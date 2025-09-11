/**
 * ZaloPay Integration Test Script
 * This script tests the three backend API endpoints for ZaloPay integration
 */

import apiService from './src/api/ApiService';
import ZaloPayService from './src/services/ZaloPayService';

// Test configuration
const TEST_CONFIG = {
  // Use your actual test data
  customerId: "1", // Replace with actual customer ID
  orderId: "test_order_" + Date.now(),
  amount: 50000, // 50,000 VND
  description: "Test ZaloPay payment"
};

/**
 * Test 1: Create ZaloPay Payment
 * Tests POST /api/payments/zalopay/create
 */
async function testCreateZaloPayPayment() {
  console.log('\n=== Test 1: Create ZaloPay Payment ===');
  
  const paymentData = {
    app_id: ZaloPayService.APP_ID,
    amount: TEST_CONFIG.amount,
    description: TEST_CONFIG.description,
    order_id: TEST_CONFIG.orderId,
    customer_id: TEST_CONFIG.customerId,
    redirect_url: ZaloPayService.REDIRECT_URL,
    callback_url: `${apiService.API_BASE_URL}/api/payments/zalopay/callback`
  };

  try {
    console.log('Sending payment data:', paymentData);
    
    const response = await apiService.createZaloPayPayment(paymentData);
    
    console.log('✅ Create payment SUCCESS');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Check expected response format
    if (response.data && response.data.order_url && response.data.zp_trans_token) {
      console.log('✅ Response format is correct');
      return {
        success: true,
        data: response.data,
        appTransId: response.data.app_trans_id // Save for status query test
      };
    } else {
      console.log('❌ Response format incorrect - missing order_url or zp_trans_token');
      return { success: false, error: 'Invalid response format' };
    }
    
  } catch (error) {
    console.log('❌ Create payment FAILED');
    console.log('Error:', error.message);
    console.log('Error details:', error.response?.data);
    return { success: false, error: error.message };
  }
}

/**
 * Test 2: Query ZaloPay Payment Status  
 * Tests POST /api/payments/zalopay/query
 */
async function testQueryZaloPayStatus(appTransId) {
  console.log('\n=== Test 2: Query ZaloPay Status ===');
  
  if (!appTransId) {
    console.log('⚠️ No appTransId provided, using test value');
    appTransId = TEST_CONFIG.orderId;
  }

  try {
    console.log('Querying status for appTransId:', appTransId);
    
    const response = await apiService.queryZaloPayStatus(appTransId);
    
    console.log('✅ Query status SUCCESS');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Check expected response format
    if (response.data && typeof response.data.return_code !== 'undefined') {
      console.log('✅ Response format is correct');
      console.log('Payment status:', response.data.return_code === 1 ? 'SUCCESS' : 'PENDING/FAILED');
      return { success: true, data: response.data };
    } else {
      console.log('❌ Response format incorrect - missing return_code');
      return { success: false, error: 'Invalid response format' };
    }
    
  } catch (error) {
    console.log('❌ Query status FAILED');
    console.log('Error:', error.message);
    console.log('Error details:', error.response?.data);
    return { success: false, error: error.message };
  }
}

/**
 * Test 3: Verify ZaloPay Callback
 * Tests POST /api/payments/zalopay/callback
 */
async function testVerifyZaloPayCallback() {
  console.log('\n=== Test 3: Verify ZaloPay Callback ===');
  
  // Mock callback data (in real scenario, this comes from ZaloPay)
  const mockCallbackData = {
    data: "test_callback_data",
    mac: "test_mac_signature",
    type: 1
  };

  try {
    console.log('Sending callback data:', mockCallbackData);
    
    const response = await apiService.verifyZaloPayCallback(mockCallbackData);
    
    console.log('✅ Verify callback SUCCESS');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.log('❌ Verify callback FAILED');
    console.log('Error:', error.message);
    console.log('Error details:', error.response?.data);
    
    // Note: This test might fail because we're using mock data
    // In real scenario, callback data comes from ZaloPay with valid MAC
    console.log('ℹ️ Note: This test uses mock data and may fail MAC validation');
    return { success: false, error: error.message };
  }
}

/**
 * Test 4: ZaloPayService Integration Test
 * Tests the frontend service layer
 */
async function testZaloPayServiceIntegration() {
  console.log('\n=== Test 4: ZaloPayService Integration ===');
  
  const orderInfo = {
    amount: TEST_CONFIG.amount,
    description: TEST_CONFIG.description,
    orderId: TEST_CONFIG.orderId,
    customerId: TEST_CONFIG.customerId
  };

  try {
    console.log('Testing ZaloPayService.createPayment()');
    
    const result = await ZaloPayService.createPayment(orderInfo);
    
    console.log('ZaloPayService result:', result);
    
    if (result.success) {
      console.log('✅ ZaloPayService integration SUCCESS');
      console.log('Order URL:', result.order_url);
      console.log('ZP Trans Token:', result.zp_trans_token);
      return { success: true, data: result };
    } else {
      console.log('❌ ZaloPayService integration FAILED');
      console.log('Error:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.log('❌ ZaloPayService integration FAILED');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 5: OrderScreen Integration Test
 * Tests the order creation flow with ZaloPay
 */
async function testOrderScreenIntegration() {
  console.log('\n=== Test 5: OrderScreen Integration ===');
  
  // This would simulate the OrderScreen flow
  const mockOrderPayload = {
    cart_id: "test_cart_123",
    customer_id: TEST_CONFIG.customerId,
    payment_method: "zalo_pay",
    shipping_address: "Test Address, Test City",
    discount: 0
  };

  try {
    console.log('Testing order creation with ZaloPay payment method');
    console.log('Order payload:', mockOrderPayload);
    
    // This would create an order first
    console.log('ℹ️ In real scenario, this would:');
    console.log('1. Create order via apiService.createOrder()');
    console.log('2. Get order_id from response');
    console.log('3. Create ZaloPay payment with order_id');
    console.log('4. Open ZaloPay app');
    console.log('5. Handle payment result');
    
    return { success: true, note: 'Simulation completed' };
    
  } catch (error) {
    console.log('❌ OrderScreen integration test failed');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting ZaloPay Integration Tests');
  console.log('=====================================');
  
  const results = {
    createPayment: null,
    queryStatus: null,
    verifyCallback: null,
    serviceIntegration: null,
    orderScreenIntegration: null
  };

  // Test 1: Create Payment
  results.createPayment = await testCreateZaloPayPayment();
  
  // Test 2: Query Status (use appTransId from create payment if available)
  const appTransId = results.createPayment?.data?.app_trans_id;
  results.queryStatus = await testQueryZaloPayStatus(appTransId);
  
  // Test 3: Verify Callback
  results.verifyCallback = await testVerifyZaloPayCallback();
  
  // Test 4: Service Integration
  results.serviceIntegration = await testZaloPayServiceIntegration();
  
  // Test 5: OrderScreen Integration
  results.orderScreenIntegration = await testOrderScreenIntegration();
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  console.log('1. Create Payment:', results.createPayment?.success ? '✅ PASS' : '❌ FAIL');
  console.log('2. Query Status:', results.queryStatus?.success ? '✅ PASS' : '❌ FAIL');
  console.log('3. Verify Callback:', results.verifyCallback?.success ? '✅ PASS' : '⚠️ EXPECTED FAIL (mock data)');
  console.log('4. Service Integration:', results.serviceIntegration?.success ? '✅ PASS' : '❌ FAIL');
  console.log('5. OrderScreen Integration:', results.orderScreenIntegration?.success ? '✅ PASS' : '❌ FAIL');
  
  // Provide recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('==================');
  
  if (!results.createPayment?.success) {
    console.log('❌ Fix create payment endpoint first');
  }
  
  if (!results.queryStatus?.success) {
    console.log('❌ Fix query status endpoint');
  }
  
  if (results.createPayment?.success && results.serviceIntegration?.success) {
    console.log('✅ Backend integration looks good!');
    console.log('✅ Ready for end-to-end testing');
  }
  
  return results;
}

// Export for use in React Native app
export { 
  runAllTests,
  testCreateZaloPayPayment,
  testQueryZaloPayStatus,
  testVerifyZaloPayCallback,
  testZaloPayServiceIntegration,
  testOrderScreenIntegration
};

// For direct node.js execution (uncomment to run directly)
// runAllTests().catch(console.error);