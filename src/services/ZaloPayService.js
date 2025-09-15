import { Alert, Linking } from 'react-native';
import apiService from '../api/ApiService';
import API_BASE_URL from '../configs/config';

class ZaloPayService {
  constructor() {
    this.APP_ID = "2553"; // Demo app ID - replace with your actual app ID
    this.KEY1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL"; // Demo key - replace with your actual key
    this.REDIRECT_URL = "demozpdk://app"; // Your app's deep link URL
  }

  /**
   * Create ZaloPay payment order
   * @param {Object} orderInfo - Order information
   * @param {number} orderInfo.amount - Payment amount in VND
   * @param {string} orderInfo.description - Order description
   * @param {string} orderInfo.orderId - Your internal order ID
   * @param {string} orderInfo.customerId - Customer ID
   * @returns {Promise} Payment creation result
   */
  async createPayment(orderInfo) {
    try {
      const { amount, description, orderId, customerId } = orderInfo;
      
      // Create payment request to your backend
      const paymentData = {
        app_id: this.APP_ID,
        amount: amount,
        description: description || `Payment for order ${orderId}`,
        order_id: orderId,
        customer_id: customerId,
        redirect_url: this.REDIRECT_URL,
        callback_url: `${API_BASE_URL}/api/payments/zalopay/callback`, // Your backend callback URL
      };

      // Call your backend API to create ZaloPay payment
      const response = await apiService.createZaloPayPayment(paymentData);
      
      if (response.data && response.data.order_url) {
        return {
          success: true,
          order_url: response.data.order_url,
          zp_trans_token: response.data.zp_trans_token,
          order_token: response.data.order_token,
        };
      } else {
        throw new Error('Failed to create ZaloPay payment');
      }
    } catch (error) {
      console.error('ZaloPay payment creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment'
      };
    }
  }

  /**
   * Open ZaloPay app or web payment
   * @param {string} orderUrl - Payment URL from ZaloPay
   * @returns {Promise} 
   */
  async openPayment(orderUrl) {
    try {
      const supported = await Linking.canOpenURL(orderUrl);
      
      if (supported) {
        await Linking.openURL(orderUrl);
        return { success: true };
      } else {
        throw new Error('Cannot open ZaloPay payment URL');
      }
    } catch (error) {
      console.error('Error opening ZaloPay:', error);
      Alert.alert(
        'Payment Error',
        'Cannot open ZaloPay app. Please ensure ZaloPay is installed or try again later.',
        [{ text: 'OK' }]
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment result from deep link
   * @param {string} url - Deep link URL with payment result
   * @returns {Object} Payment result
   */
  parsePaymentResult(url) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const status = urlParams.get('status');
      const orderId = urlParams.get('apptransid');
      
      return {
        success: status === '1',
        status: status,
        orderId: orderId,
        message: status === '1' ? 'Payment successful' : 'Payment failed'
      };
    } catch (error) {
      console.error('Error parsing payment result:', error);
      return {
        success: false,
        error: 'Failed to parse payment result'
      };
    }
  }

  /**
   * Query payment status from ZaloPay
   * @param {string} appTransId - ZaloPay transaction ID
   * @returns {Promise} Payment status
   */
  async queryPaymentStatus(appTransId) {
    try {
      const response = await apiService.queryZaloPayStatus(appTransId);
      
      return {
        success: response.data.return_code === 1,
        status: response.data.return_code,
        message: response.data.return_message,
        data: response.data
      };
    } catch (error) {
      console.error('Error querying payment status:', error);
      return {
        success: false,
        error: error.message || 'Failed to query payment status'
      };
    }
  }

  /**
   * Handle the complete payment flow
   * @param {Object} orderInfo - Order information
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async processPayment(orderInfo, onSuccess, onError) {
    try {
      // Step 1: Create payment
      const paymentResult = await this.createPayment(orderInfo);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // Step 2: Open ZaloPay
      const openResult = await this.openPayment(paymentResult.order_url);
      
      if (openResult.success) {
        // Payment app opened successfully
        // Note: Actual payment result will come through deep link
        Alert.alert(
          'Payment Started',
          'ZaloPay has been opened. Complete the payment and return to the app.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(openResult.error);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert('Payment Error', error.message || 'Payment failed');
      }
    }
  }
}

export default new ZaloPayService();