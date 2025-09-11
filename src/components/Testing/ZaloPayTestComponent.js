import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import apiService from '../../api/ApiService';
import ZaloPayService from '../../services/ZaloPayService';
import Colors from '../../styles/Color';

const ZaloPayTestComponent = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('50000');
  const [orderId, setOrderId] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = { id: Date.now(), message, type, timestamp };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const loadCustomerId = async () => {
    try {
      const storedCustomerId = await SecureStore.getItemAsync('customer_id');
      if (storedCustomerId) {
        setCustomerId(storedCustomerId);
        addLog(`Loaded customer ID: ${storedCustomerId}`, 'success');
      } else {
        addLog('No customer ID found in storage', 'error');
      }
    } catch (error) {
      addLog(`Error loading customer ID: ${error.message}`, 'error');
    }
  };

  React.useEffect(() => {
    loadCustomerId();
    setOrderId(`test_order_${Date.now()}`);
  }, []);

  const clearLogs = () => setLogs([]);

  const testCreateZaloPayPayment = async () => {
    if (!customerId || !amount) {
      Alert.alert('Error', 'Please enter customer ID and amount');
      return;
    }

    addLog('🚀 Starting Create Payment Test', 'info');
    setLoading(true);

    try {
      const paymentData = {
        app_id: ZaloPayService.APP_ID,
        amount: parseInt(amount),
        description: `Test payment - ${orderId}`,
        order_id: orderId,
        customer_id: customerId,
        redirect_url: ZaloPayService.REDIRECT_URL,
        callback_url: `${apiService.API_BASE_URL}/api/payments/zalopay/callback`
      };

      addLog(`Sending payment data: ${JSON.stringify(paymentData)}`, 'info');
      
      const response = await apiService.createZaloPayPayment(paymentData);
      
      addLog(`✅ Create payment SUCCESS - Status: ${response.status}`, 'success');
      addLog(`Response: ${JSON.stringify(response.data)}`, 'success');

      if (response.data?.order_url && response.data?.zp_trans_token) {
        addLog('✅ Response format is correct', 'success');
        setTestResults(prev => ({ ...prev, createPayment: { success: true, data: response.data } }));
        
        Alert.alert(
          'Payment Created Successfully!',
          `Order URL: ${response.data.order_url.substring(0, 50)}...`,
          [
            { text: 'Test Opening ZaloPay', onPress: () => testOpenZaloPayment(response.data.order_url) },
            { text: 'OK' }
          ]
        );
      } else {
        addLog('❌ Response format incorrect - missing required fields', 'error');
        setTestResults(prev => ({ ...prev, createPayment: { success: false, error: 'Invalid response format' } }));
      }

    } catch (error) {
      addLog(`❌ Create payment FAILED: ${error.message}`, 'error');
      if (error.response?.data) {
        addLog(`Error details: ${JSON.stringify(error.response.data)}`, 'error');
      }
      setTestResults(prev => ({ ...prev, createPayment: { success: false, error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testOpenZaloPayment = async (orderUrl) => {
    addLog('🚀 Testing ZaloPay App Opening', 'info');
    
    try {
      const result = await ZaloPayService.openPayment(orderUrl);
      if (result.success) {
        addLog('✅ ZaloPay app opened successfully', 'success');
        Alert.alert(
          'ZaloPay Opened',
          'ZaloPay app should have opened. Complete the payment and return to test the callback.'
        );
      } else {
        addLog(`❌ Failed to open ZaloPay: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`❌ Error opening ZaloPay: ${error.message}`, 'error');
    }
  };

  const testQueryPaymentStatus = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Please enter an order/app trans ID');
      return;
    }

    addLog('🚀 Starting Query Status Test', 'info');
    setLoading(true);

    try {
      addLog(`Querying status for: ${orderId}`, 'info');
      
      const response = await apiService.queryZaloPayStatus(orderId);
      
      addLog(`✅ Query status SUCCESS - Status: ${response.status}`, 'success');
      addLog(`Response: ${JSON.stringify(response.data)}`, 'success');

      if (response.data && typeof response.data.return_code !== 'undefined') {
        const status = response.data.return_code === 1 ? 'SUCCESS' : 'PENDING/FAILED';
        addLog(`✅ Payment status: ${status}`, 'success');
        setTestResults(prev => ({ ...prev, queryStatus: { success: true, data: response.data } }));
        
        Alert.alert('Query Result', `Payment Status: ${status}`);
      } else {
        addLog('❌ Response format incorrect - missing return_code', 'error');
        setTestResults(prev => ({ ...prev, queryStatus: { success: false, error: 'Invalid response format' } }));
      }

    } catch (error) {
      addLog(`❌ Query status FAILED: ${error.message}`, 'error');
      if (error.response?.data) {
        addLog(`Error details: ${JSON.stringify(error.response.data)}`, 'error');
      }
      setTestResults(prev => ({ ...prev, queryStatus: { success: false, error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testZaloPayServiceIntegration = async () => {
    if (!customerId || !amount) {
      Alert.alert('Error', 'Please enter customer ID and amount');
      return;
    }

    addLog('🚀 Starting ZaloPayService Integration Test', 'info');
    setLoading(true);

    try {
      const orderInfo = {
        amount: parseInt(amount),
        description: `Service test - ${orderId}`,
        orderId: orderId,
        customerId: customerId
      };

      addLog(`Testing with order info: ${JSON.stringify(orderInfo)}`, 'info');
      
      const result = await ZaloPayService.createPayment(orderInfo);
      
      addLog(`Service result: ${JSON.stringify(result)}`, 'info');

      if (result.success) {
        addLog('✅ ZaloPayService integration SUCCESS', 'success');
        setTestResults(prev => ({ ...prev, serviceIntegration: { success: true, data: result } }));
        
        Alert.alert(
          'Service Integration Success!',
          'ZaloPayService is working correctly with your backend.',
          [
            { text: 'Test Full Flow', onPress: () => testFullPaymentFlow(result) },
            { text: 'OK' }
          ]
        );
      } else {
        addLog(`❌ ZaloPayService integration FAILED: ${result.error}`, 'error');
        setTestResults(prev => ({ ...prev, serviceIntegration: { success: false, error: result.error } }));
      }

    } catch (error) {
      addLog(`❌ Service integration ERROR: ${error.message}`, 'error');
      setTestResults(prev => ({ ...prev, serviceIntegration: { success: false, error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testFullPaymentFlow = async (paymentResult) => {
    addLog('🚀 Starting Full Payment Flow Test', 'info');
    
    try {
      // Simulate the OrderScreen flow
      addLog('1. ✅ Order created (simulated)', 'success');
      addLog('2. ✅ ZaloPay payment created', 'success');
      addLog('3. Opening ZaloPay app...', 'info');
      
      await ZaloPayService.openPayment(paymentResult.order_url);
      
      addLog('3. ✅ ZaloPay app opened', 'success');
      addLog('4. ⏳ Waiting for user to complete payment...', 'info');
      
      Alert.alert(
        'Full Flow Test',
        'Complete the payment in ZaloPay and return to the app. Then test the status query to verify the payment result.',
        [
          { text: 'Query Status After Payment', onPress: testQueryPaymentStatus },
          { text: 'OK' }
        ]
      );
      
    } catch (error) {
      addLog(`❌ Full flow test failed: ${error.message}`, 'error');
    }
  };

  const testOrderScreenIntegration = async () => {
    addLog('🚀 Testing OrderScreen Integration', 'info');
    
    // Navigate to OrderScreen with test data
    const testCartItems = [
      {
        product_name: 'Test Product',
        unit_price: parseInt(amount) / 2,
        quantity: 2,
        image_url: '/placeholder-image.jpg'
      }
    ];
    
    addLog('Navigating to OrderScreen with test data...', 'info');
    
    navigation.navigate('OrderScreen', {
      cartId: 'test_cart_123',
      cartItems: testCartItems
    });
  };

  const renderTestButton = (title, onPress, loading = false, disabled = false) => (
    <TouchableOpacity
      style={[styles.testButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={Colors.whiteColor} size="small" />
      ) : (
        <Text style={styles.testButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  const renderLog = (log) => (
    <View key={log.id} style={[styles.logItem, styles[`log_${log.type}`]]}>
      <Text style={styles.logTime}>{log.timestamp}</Text>
      <Text style={styles.logMessage}>{log.message}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ZaloPay Integration Tester</Text>
        <Text style={styles.subtitle}>Test your backend integration</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Configuration</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Customer ID:</Text>
          <TextInput
            style={styles.textInput}
            value={customerId}
            onChangeText={setCustomerId}
            placeholder="Enter customer ID"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount (VND):</Text>
          <TextInput
            style={styles.textInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Order/App Trans ID:</Text>
          <TextInput
            style={styles.textInput}
            value={orderId}
            onChangeText={setOrderId}
            placeholder="Order ID for testing"
          />
        </View>

        <TouchableOpacity style={styles.reloadButton} onPress={loadCustomerId}>
          <Text style={styles.reloadButtonText}>🔄 Reload Customer ID</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Tests</Text>
        
        {renderTestButton('1. Test Create Payment', testCreateZaloPayPayment, loading)}
        {renderTestButton('2. Test Query Status', testQueryPaymentStatus, loading)}
        {renderTestButton('3. Test Service Integration', testZaloPayServiceIntegration, loading)}
        {renderTestButton('4. Test Full Payment Flow', testFullPaymentFlow, loading, !testResults.createPayment?.success)}
        {renderTestButton('5. Test OrderScreen Integration', testOrderScreenIntegration)}
      </View>

      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>Test Logs</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.logContainer}>
          {logs.length === 0 ? (
            <Text style={styles.noLogsText}>No logs yet. Run a test to see results.</Text>
          ) : (
            logs.map(renderLog)
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Summary</Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryItem}>
            Create Payment: {testResults.createPayment?.success ? '✅ PASS' : '❌ NOT TESTED'}
          </Text>
          <Text style={styles.summaryItem}>
            Query Status: {testResults.queryStatus?.success ? '✅ PASS' : '❌ NOT TESTED'}
          </Text>
          <Text style={styles.summaryItem}>
            Service Integration: {testResults.serviceIntegration?.success ? '✅ PASS' : '❌ NOT TESTED'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  reloadButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  reloadButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  testButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '500',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: Colors.whiteColor,
    fontSize: 12,
  },
  logContainer: {
    maxHeight: 300,
  },
  logItem: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    borderLeftWidth: 3,
  },
  log_info: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
  },
  log_success: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  log_error: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
  },
  logTime: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  logMessage: {
    fontSize: 12,
    color: Colors.blackColor,
    marginTop: 2,
  },
  noLogsText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: Colors.whiteBgColor,
    padding: 12,
    borderRadius: 6,
  },
  summaryItem: {
    fontSize: 14,
    color: Colors.blackColor,
    marginBottom: 4,
  },
});

export default ZaloPayTestComponent;