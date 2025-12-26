import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Colors from '../../styles/Color';
import ZaloPayService from '../../services/ZaloPayService';
import * as SecureStore from 'expo-secure-store';

const ZaloPayStatusScreen = ({ navigation, route }) => {
  const { orderId, appTransId, amount, description } = route.params;
  
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [statusMessage, setStatusMessage] = useState('Đang xử lý thanh toán...');
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Start polling when screen loads
    startPaymentStatusPolling();
    
    // Handle app state changes (when user returns from ZaloPay)
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // Clean up
      ZaloPayService.stopPolling();
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to foreground, check payment status immediately
      console.log('App returned to foreground, checking payment status...');
      checkPaymentStatusOnce();
    }
    setAppState(nextAppState);
  };

  const startPaymentStatusPolling = () => {
    setLoading(true);
    
    // Poll backend for payment status
    ZaloPayService.pollPaymentStatus(
      appTransId,
      (statusUpdate) => {
        // Handle each status update
        console.log('Payment status update:', statusUpdate);
        updatePaymentStatus(statusUpdate);
      }
    ).then((finalStatus) => {
      // Handle final status
      console.log('Final payment status:', finalStatus);
      updatePaymentStatus(finalStatus);
      setLoading(false);
      
      // Navigate based on final status
      if (finalStatus.status === 'success') {
        handlePaymentSuccess();
      } else if (finalStatus.status === 'timeout') {
        handlePaymentTimeout();
      } else {
        handlePaymentFailure(finalStatus.message || 'Thanh toán không thành công');
      }
    });
  };

  const checkPaymentStatusOnce = async () => {
    try {
      const result = await ZaloPayService.queryPaymentStatus(appTransId);
      updatePaymentStatus(result);
      
      if (result.status === 'success') {
        ZaloPayService.stopPolling();
        handlePaymentSuccess();
      } else if (result.status === 'failed' || result.status === 'cancelled') {
        ZaloPayService.stopPolling();
        handlePaymentFailure(result.message);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const updatePaymentStatus = (statusUpdate) => {
    setPaymentStatus(statusUpdate.status);
    setStatusMessage(statusUpdate.message || ZaloPayService.getStatusMessage(statusUpdate.status));
  };

  const handlePaymentSuccess = async () => {
    // Check auth state when payment succeeds
    const accessToken = await SecureStore.getItemAsync('access_token');
    const customerId = await SecureStore.getItemAsync('customer_id');
    console.log('Auth state on payment success:', {
      hasAccessToken: !!accessToken,
      customerId: customerId
    });
    
    Alert.alert(
      'Thanh toán thành công!',
      `Đơn hàng #${orderId} đã được thanh toán thành công.`,
      [
        {
          text: 'Xem đơn hàng',
          onPress: async () => {
            const preNavToken = await SecureStore.getItemAsync('access_token');
            console.log('Has token before OrderDetailsScreen nav:', !!preNavToken);
            navigation.navigate('OrderDetailsScreen', { orderId });
          },
        },
        {
          text: 'Về trang chủ',
          onPress: async () => {
            const preNavToken = await SecureStore.getItemAsync('access_token');
            console.log('Has token before HomeScreen nav:', !!preNavToken);
            navigation.navigate('HomeScreen');
          },
        },
      ]
    );
  };

  const handlePaymentFailure = (message) => {
    Alert.alert(
      'Thanh toán thất bại',
      message || 'Thanh toán không thành công. Vui lòng thử lại.',
      [
        {
          text: 'Thử lại',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Hủy',
          style: 'cancel',
          onPress: () => navigation.navigate('HomeScreen'),
        },
      ]
    );
  };

  const handlePaymentTimeout = () => {
    Alert.alert(
      'Hết thời gian chờ',
      'Không thể xác nhận trạng thái thanh toán. Vui lòng kiểm tra lịch sử đơn hàng.',
      [
        {
          text: 'Kiểm tra đơn hàng',
          onPress: () => navigation.navigate('OrderHistoryScreen'),
        },
        {
          text: 'Về trang chủ',
          onPress: () => navigation.navigate('HomeScreen'),
        },
      ]
    );
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <MaterialIcons name="check-circle" size={80} color={Colors.success} />;
      case 'failed':
      case 'cancelled':
        return <MaterialIcons name="cancel" size={80} color={Colors.danger} />;
      case 'timeout':
        return <MaterialIcons name="access-time" size={80} color={Colors.warning} />;
      default:
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return Colors.success;
      case 'failed':
      case 'cancelled':
        return Colors.danger;
      case 'timeout':
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  return (
    <LinearGradient
      colors={['#1a73e8', '#e3f2fd']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trạng thái thanh toán</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.statusCard}>
            {getStatusIcon()}
            
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {statusMessage}
            </Text>

            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Mã đơn hàng</Text>
              <Text style={styles.orderValue}>#{orderId}</Text>
            </View>

            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Số tiền</Text>
              <Text style={styles.orderValue}>
                {amount.toLocaleString('vi-VN')} VND
              </Text>
            </View>

            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Mô tả</Text>
              <Text style={styles.orderValue}>{description}</Text>
            </View>
          </View>

          {paymentStatus === 'pending' && (
            <View style={styles.infoCard}>
              <Feather name="info" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                Vui lòng hoàn tất thanh toán trong ứng dụng ZaloPay và quay lại đây
              </Text>
            </View>
          )}

          {!loading && paymentStatus !== 'pending' && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => navigation.navigate('OrderHistoryScreen')}
              >
                <Text style={styles.buttonText}>Xem lịch sử đơn hàng</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.whiteColor,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  orderInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: 10,
  },
  orderLabel: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.primary,
  },
  actions: {
    marginTop: 30,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ZaloPayStatusScreen;