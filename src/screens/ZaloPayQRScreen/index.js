import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Feather, MaterialIcons, AntDesign } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import ZaloPayService from '../../services/ZaloPayService';
import apiService from '../../api/ApiService';

const { width: screenWidth } = Dimensions.get('window');
const QR_SIZE = screenWidth * 0.6;

const ZaloPayQRScreen = ({ navigation, route }) => {
  const { 
    orderId, 
    amount, 
    orderUrl, 
    zpTransToken,
    description 
  } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const intervalRef = useRef(null);
  const checkStatusInterval = useRef(null);

  useEffect(() => {
    if (!orderUrl || !orderId) {
      Alert.alert('Error', 'Missing payment information');
      navigation.goBack();
      return;
    }

    // Start countdown timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Check payment status every 5 seconds
    checkStatusInterval.current = setInterval(() => {
      checkPaymentStatus();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (checkStatusInterval.current) clearInterval(checkStatusInterval.current);
    };
  }, [orderId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeout = () => {
    Alert.alert(
      'Payment Timeout',
      'The payment session has expired. Please try again.',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const checkPaymentStatus = async () => {
    try {
      const result = await ZaloPayService.queryPaymentStatus(orderId);
      
      if (result.success && result.status === 1) {
        // Payment successful
        setPaymentStatus('success');
        clearInterval(checkStatusInterval.current);
        clearInterval(intervalRef.current);
        
        setTimeout(() => {
          Alert.alert(
            'Payment Successful!',
            'Your payment has been completed successfully.',
            [
              {
                text: 'View Order',
                onPress: () => navigation.navigate('MyOrdersScreen')
              }
            ]
          );
        }, 500);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleOpenZaloPayApp = async () => {
    try {
      const result = await ZaloPayService.openPayment(orderUrl);
      if (!result.success) {
        Alert.alert(
          'Cannot Open ZaloPay',
          'Please ensure ZaloPay app is installed on your device.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening ZaloPay:', error);
    }
  };

  const handleManualCheck = async () => {
    setLoading(true);
    await checkPaymentStatus();
    setLoading(false);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => navigation.goBack(),
          style: 'destructive'
        }
      ]
    );
  };

  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <AntDesign name="checkcircle" size={80} color={Colors.success} />
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>
            Your order has been paid successfully via ZaloPay.
          </Text>
          <TouchableOpacity 
            style={styles.successButton}
            onPress={() => navigation.navigate('MyOrdersScreen')}
          >
            <Text style={styles.successButtonText}>View My Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Feather name="x" size={24} color={Colors.blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ZaloPay Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>
            {amount?.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={orderUrl || 'https://zalopay.vn'}
              size={QR_SIZE}
              color={Colors.blackColor}
              backgroundColor={Colors.whiteColor}
            />
          </View>
          
          <View style={styles.qrLogoContainer}>
            <Text style={styles.qrLogoText}>ZaloPay</Text>
          </View>
        </View>

        <Text style={styles.instructionTitle}>Payment Instructions:</Text>
        <View style={styles.instructionContainer}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              Open ZaloPay app on your phone
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Select "Scan QR" from the home screen
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Scan the QR code above to pay
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.openAppButton}
          onPress={handleOpenZaloPayApp}
        >
          <MaterialIcons name="open-in-new" size={20} color={Colors.whiteColor} />
          <Text style={styles.openAppButtonText}>Open ZaloPay App</Text>
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Feather name="clock" size={20} color={Colors.warning} />
          <Text style={styles.timerText}>
            Time remaining: {formatTime(timeLeft)}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.checkStatusButton}
          onPress={handleManualCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="small" />
          ) : (
            <>
              <Feather name="refresh-cw" size={18} color={Colors.primary} />
              <Text style={styles.checkStatusText}>Check Payment Status</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoLabel}>Order ID:</Text>
          <Text style={styles.orderInfoValue}>{orderId}</Text>
        </View>

        {description && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoLabel}>Description:</Text>
            <Text style={styles.orderInfoValue}>{description}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.whiteColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrLogoContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    padding: 10,
  },
  qrLogo: {
    width: '100%',
    height: '100%',
  },
  qrLogoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 16,
  },
  instructionContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.whiteColor,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  openAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  openAppButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
  },
  checkStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  checkStatusText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderInfoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  successButton: {
    backgroundColor: Colors.success,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  successButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ZaloPayQRScreen;