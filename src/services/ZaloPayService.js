import { Alert, Linking } from 'react-native';
import apiService from '../api/ApiService';

class ZaloPayService {
  constructor() {
    this.pollingInterval = null;
    this.maxPollingAttempts = 30; // Poll for max 5 minutes (30 * 10 seconds)
    this.pollingDelay = 10000; // Poll every 10 seconds
  }

  /**
   * Create ZaloPay payment via backend
   * Backend handles all ZaloPay logic including MAC generation
   * @param {Object} orderInfo - Order information
   * @param {string} orderInfo.order_id - Order ID
   * @param {string} orderInfo.description - Order description (optional)
   * @returns {Promise} Payment creation result with order_url
   */
  async createPayment(orderInfo) {
    try {
      const { order_id, description } = orderInfo;
      
      console.log('ZaloPayService: Creating payment for order:', order_id);
      
      // Call backend API to create ZaloPay payment
      // Backend will get amount from the order automatically
      const response = await apiService.createZaloPayPayment({
        order_id: order_id,
        description: description || `Payment for order ${order_id}`
      });
      
      console.log('ZaloPayService: API Response:', response.data);
      
      // Check if we have the required fields
      if (response.data && response.data.order_url) {
        return {
          success: true,
          app_trans_id: response.data.app_trans_id,
          transaction_id: response.data.transaction_id,
          order_url: response.data.order_url,
          zp_trans_token: response.data.zp_trans_token
        };
      } else if (response.data && response.data.message) {
        // Handle error response from backend
        throw new Error(response.data.message);
      } else {
        throw new Error('Invalid response from payment API');
      }
    } catch (error) {
      console.error('ZaloPayService: Payment creation error:', error);
      console.error('ZaloPayService: Error details:', error.response?.data);
      
      // Check for specific error types
      let errorMessage = 'Failed to create payment';
      
      if (error.response?.status === 404) {
        errorMessage = 'Order not found. Please wait and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        statusCode: error.response?.status
      };
    }
  }

  /**
   * Open ZaloPay app using the order URL from backend
   * @param {string} orderUrl - Payment URL from backend
   * @returns {Promise} 
   */
  async openPayment(orderUrl) {
    try {
      console.log('ZaloPayService: Opening payment URL:', orderUrl);
      
      // For sandbox environment, we need special handling
      // ZaloPay Sandbox uses different URL schemes than production
      
      // Try different approaches to open ZaloPay Sandbox
      const openStrategies = [
        // Strategy 1: Try ZaloPay Sandbox scheme directly
        async () => {
          const sandboxScheme = 'zalopay-sandbox://app?order=' + orderUrl.split('order=')[1];
          console.log('Trying ZaloPay Sandbox scheme:', sandboxScheme);
          const canOpen = await Linking.canOpenURL(sandboxScheme);
          if (canOpen) {
            await Linking.openURL(sandboxScheme);
            return true;
          }
          return false;
        },
        
        // Strategy 2: Try ZaloPay production scheme
        async () => {
          const zalopayScheme = 'zalopay://app?order=' + orderUrl.split('order=')[1];
          console.log('Trying ZaloPay scheme:', zalopayScheme);
          const canOpen = await Linking.canOpenURL(zalopayScheme);
          if (canOpen) {
            await Linking.openURL(zalopayScheme);
            return true;
          }
          return false;
        },
        
        // Strategy 3: Open original URL (may open Zalo instead of ZaloPay)
        async () => {
          console.log('Opening original URL:', orderUrl);
          await Linking.openURL(orderUrl);
          return true;
        },
        
        // Strategy 4: Open in browser as last resort
        async () => {
          // Convert to QR display URL for browser
          const qrUrl = orderUrl.replace('openinapp', 'pay/v2/qr');
          console.log('Opening QR URL in browser:', qrUrl);
          await Linking.openURL(qrUrl);
          return true;
        }
      ];
      
      // Try each strategy in order
      for (const strategy of openStrategies) {
        try {
          const success = await strategy();
          if (success) {
            console.log('ZaloPayService: Successfully opened payment');
            return { success: true };
          }
        } catch (err) {
          console.log('Strategy failed:', err.message);
        }
      }
      
      throw new Error('All strategies failed');
      
    } catch (error) {
      console.error('ZaloPayService: Error opening payment URL:', error);
      Alert.alert(
        'Lỗi mở ZaloPay',
        'Không thể mở ZaloPay Sandbox. Vui lòng thử:\n\n' +
        '1. Kiểm tra ZaloPay Sandbox đã được cài đặt\n' +
        '2. Sao chép link và mở trong trình duyệt\n' +
        '3. Quét mã QR từ máy khác',
        [
          { text: 'OK' }
        ]
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Query payment status from backend
   * Backend is the source of truth for payment status
   * @param {string} appTransId - App transaction ID from payment creation
   * @returns {Promise} Payment status from backend
   */
  async queryPaymentStatus(appTransId) {
    try {
      console.log('ZaloPayService: Querying status for app_trans_id:', appTransId);
      
      const response = await apiService.queryZaloPayStatus(appTransId);
      
      console.log('ZaloPayService: Status response:', response.data);
      
      // Handle different possible response formats
      const status = response.data?.status || response.data?.payment_status || 'pending';
      
      return {
        success: status === 'success' || status === 'completed',
        status: status,
        message: response.data?.message || this.getStatusMessage(status),
        data: response.data
      };
    } catch (error) {
      console.error('ZaloPayService: Error querying payment status:', error);
      console.error('ZaloPayService: Status error details:', error.response?.data);
      
      return {
        success: false,
        status: 'error',
        error: error.response?.data?.message || error.message || 'Failed to query payment status'
      };
    }
  }

  /**
   * Poll payment status until completed or timeout
   * @param {string} appTransId - App transaction ID to poll
   * @param {Function} onStatusUpdate - Callback for status updates
   * @returns {Promise} Final payment status
   */
  async pollPaymentStatus(appTransId, onStatusUpdate) {
    let attempts = 0;
    
    return new Promise((resolve) => {
      const checkStatus = async () => {
        attempts++;
        
        try {
          const result = await this.queryPaymentStatus(appTransId);
          
          // Notify caller of status update
          if (onStatusUpdate) {
            onStatusUpdate(result);
          }
          
          // Check if payment is completed (success or failed)
          if (result.status === 'success' || result.status === 'failed' || result.status === 'cancelled') {
            this.stopPolling();
            resolve(result);
          } else if (attempts >= this.maxPollingAttempts) {
            // Timeout after max attempts
            this.stopPolling();
            resolve({
              success: false,
              status: 'timeout',
              message: 'Payment verification timeout. Please check your order status.'
            });
          }
        } catch (error) {
          console.error('Polling error:', error);
          // Continue polling on error unless max attempts reached
          if (attempts >= this.maxPollingAttempts) {
            this.stopPolling();
            resolve({
              success: false,
              status: 'error',
              error: 'Failed to verify payment status'
            });
          }
        }
      };
      
      // Start polling immediately
      checkStatus();
      
      // Set up polling interval
      this.pollingInterval = setInterval(checkStatus, this.pollingDelay);
    });
  }

  /**
   * Stop polling for payment status
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Handle the complete payment flow
   * @param {Object} orderInfo - Order information
   * @param {Function} onStatusUpdate - Called when payment status updates
   * @param {Function} onComplete - Called when payment completes
   */
  async processPayment(orderInfo, onStatusUpdate, onComplete) {
    try {
      // Step 1: Create payment via backend
      const paymentResult = await this.createPayment(orderInfo);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // Step 2: Open ZaloPay app
      const openResult = await this.openPayment(paymentResult.order_url);
      
      if (!openResult.success) {
        throw new Error(openResult.error);
      }

      // Step 3: Start polling for payment status
      Alert.alert(
        'Payment Started',
        'Complete the payment in ZaloPay and return to the app.',
        [{ text: 'OK' }]
      );
      
      // Poll backend for payment status
      const finalStatus = await this.pollPaymentStatus(
        paymentResult.app_trans_id,
        onStatusUpdate
      );
      
      // Call completion handler
      if (onComplete) {
        onComplete(finalStatus);
      }
      
      return finalStatus;
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorResult = {
        success: false,
        status: 'error',
        error: error.message || 'Payment failed'
      };
      
      if (onComplete) {
        onComplete(errorResult);
      }
      
      return errorResult;
    }
  }

  /**
   * Get user-friendly status message
   * @param {string} status - Payment status
   * @returns {string} Status message
   */
  getStatusMessage(status) {
    const messages = {
      'pending': 'Payment is being processed',
      'success': 'Payment completed successfully',
      'failed': 'Payment failed',
      'cancelled': 'Payment was cancelled',
      'timeout': 'Payment verification timeout',
      'error': 'Payment error occurred'
    };
    return messages[status] || 'Unknown payment status';
  }
}

export default new ZaloPayService();