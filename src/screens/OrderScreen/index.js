import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, AntDesign } from 'react-native-vector-icons';
import * as SecureStore from 'expo-secure-store';
import Colors from '../../styles/Color';
import apiService from '../../api/ApiService';
import API_BASE_URL from '../../configs/config';

const OrderScreen = ({ navigation, route }) => {
  const { cartId, cartItems = [] } = route.params || {};
  
  const [orderData, setOrderData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_phone: '',
    payment_method: 'cash_on_delivery',
    shipping_method: 'standard',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [orderItems, setOrderItems] = useState(cartItems);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    loadCustomerData();
    calculateTotal();
  }, [orderItems]);

  useEffect(() => {
    calculateShippingFee();
  }, [orderData.shipping_method]);

  const calculateShippingFee = () => {
    const shippingRates = {
      standard: 25000, // 25,000 VND
      express: 50000,  // 50,000 VND
      overnight: 100000 // 100,000 VND
    };
    setShippingFee(shippingRates[orderData.shipping_method] || 25000);
  };

  const loadCustomerData = async () => {
    try {
      const customerIdStored = await SecureStore.getItemAsync('customer_id');
      setCustomerId(customerIdStored);
    } catch (error) {
      console.error('Error loading customer data:', error);
      Alert.alert('Error', 'Please login to continue');
      navigation.navigate('LoginScreen');
    }
  };

  const calculateTotal = () => {
    const total = orderItems.reduce((sum, item) => {
      return sum + (item.unit_price * item.quantity);
    }, 0);
    setTotalAmount(total);
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateOrderData = () => {
    if (!orderData.shipping_address.trim()) {
      Alert.alert('Validation Error', 'Please enter shipping address');
      return false;
    }
    if (!orderData.shipping_city.trim()) {
      Alert.alert('Validation Error', 'Please enter shipping city');
      return false;
    }
    if (!orderData.shipping_phone.trim()) {
      Alert.alert('Validation Error', 'Please enter shipping phone');
      return false;
    }
    if (!orderData.shipping_method) {
      Alert.alert('Validation Error', 'Please select a shipping method');
      return false;
    }
    if (!orderData.payment_method) {
      Alert.alert('Validation Error', 'Please select a payment method');
      return false;
    }
    if (orderItems.length === 0) {
      Alert.alert('Validation Error', 'No items in cart');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    if (!validateOrderData()) return;

    try {
      setLoading(true);

      // Use the simplified backend API format based on your test
      const orderPayload = {
        cart_id: cartId,
        customer_id: customerId,
        payment_method: orderData.payment_method,
        shipping_address: `${orderData.shipping_address}, ${orderData.shipping_city}`,
        discount: 0 // Default discount
      };
      
      // Add optional fields if provided
      if (orderData.notes && orderData.notes.trim()) {
        orderPayload.notes = orderData.notes;
      }
      if (orderData.shipping_phone && orderData.shipping_phone.trim()) {
        orderPayload.shipping_phone = orderData.shipping_phone;
      }

      console.log('Creating order with payload:', orderPayload);
      console.log('Cart ID being used:', cartId);
      console.log('Customer ID being used:', customerId);

      const response = await apiService.createOrder(orderPayload);

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          'Order Placed Successfully!',
          `Your order has been created. Order ID: ${response.data.order_id || 'N/A'}`,
          [
            {
              text: 'Continue Shopping',
              onPress: () => navigation.navigate('HomeScreen')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Order creation error:', error);
      console.log('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create order. Please try again.';
      Alert.alert('Order Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item, index }) => (
    <View key={index} style={styles.orderItem}>
      <Image
        source={{ uri: `${API_BASE_URL}${item.image_url}` }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.itemPrice}>
          {item.unit_price} VND
          {
            console.log("DATA ITEM: ", item)
          }
        </Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>
        {item.unit_price * item.quantity} VND
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Creating your order...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Các mặt hàng</Text>
          {orderItems.map((item, index) => renderOrderItem({ item, index }))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Địa chỉ giao hàng *</Text>
            <TextInput
              style={styles.textInput}
              value={orderData.shipping_address}
              onChangeText={(value) => handleInputChange('shipping_address', value)}
              placeholder="Nhập địa chỉ đầy đủ của bạn"
              multiline={true}
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Thành phố *</Text>
            <TextInput
              style={styles.textInput}
              value={orderData.shipping_city}
              onChangeText={(value) => handleInputChange('shipping_city', value)}
              placeholder="Nhập thành phố của bạn"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại *</Text>
            <TextInput
              style={styles.textInput}
              value={orderData.shipping_phone}
              onChangeText={(value) => handleInputChange('shipping_phone', value)}
              placeholder="Nhập số điện thoại của bạn"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          
          <TouchableOpacity
            style={[
              styles.shippingOption,
              orderData.shipping_method === 'standard' && styles.selectedShipping
            ]}
            onPress={() => handleInputChange('shipping_method', 'standard')}
          >
            <View style={styles.shippingInfo}>
              <MaterialIcons name="local-shipping" size={24} color={Colors.primary} />
              <View style={styles.shippingDetails}>
                <Text style={styles.shippingName}>Giao hàng tiêu chuẩn</Text>
                <Text style={styles.shippingTime}>3-5 ngày làm việc</Text>
              </View>
            </View>
            <View style={styles.shippingRight}>
              <Text style={styles.shippingPrice}>
                {new Intl.NumberFormat('vi-VN').format(25000)} VND
              </Text>
              {orderData.shipping_method === 'standard' && (
                <Feather name="check-circle" size={20} color={Colors.success} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shippingOption,
              orderData.shipping_method === 'express' && styles.selectedShipping
            ]}
            onPress={() => handleInputChange('shipping_method', 'express')}
          >
            <View style={styles.shippingInfo}>
              <MaterialIcons name="flash-on" size={24} color={Colors.warning} />
              <View style={styles.shippingDetails}>
                <Text style={styles.shippingName}>Giao hàng nhanh</Text>
                <Text style={styles.shippingTime}>1-2 ngày làm việc</Text>
              </View>
            </View>
            <View style={styles.shippingRight}>
              <Text style={styles.shippingPrice}>
                {new Intl.NumberFormat('vi-VN').format(50000)} VND
              </Text>
              {orderData.shipping_method === 'express' && (
                <Feather name="check-circle" size={20} color={Colors.success} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shippingOption,
              orderData.shipping_method === 'overnight' && styles.selectedShipping
            ]}
            onPress={() => handleInputChange('shipping_method', 'overnight')}
          >
            <View style={styles.shippingInfo}>
              <MaterialIcons name="flight-takeoff" size={24} color={Colors.error} />
              <View style={styles.shippingDetails}>
                <Text style={styles.shippingName}>Giao hàng qua đêm</Text>
                <Text style={styles.shippingTime}>Ngày làm việc tiếp theo</Text>
              </View>
            </View>
            <View style={styles.shippingRight}>
              <Text style={styles.shippingPrice}>
                {new Intl.NumberFormat('vi-VN').format(100000)} VND
              </Text>
              {orderData.shipping_method === 'overnight' && (
                <Feather name="check-circle" size={20} color={Colors.success} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              orderData.payment_method === 'qr_code' && styles.selectedPayment
            ]}
            onPress={() => handleInputChange('payment_method', 'qr_code')}
          >
            <AntDesign name="qrcode" size={24} color={Colors.primary} />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentText}>Quét mã QR để thanh toán</Text>
              <Text style={styles.paymentSubtext}>Thanh toán nhanh chóng và an toàn</Text>
            </View>
            {orderData.payment_method === 'qr_code' && (
              <Feather name="check-circle" size={20} color={Colors.success} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              orderData.payment_method === 'zalo_pay' && styles.selectedPayment
            ]}
            onPress={() => handleInputChange('payment_method', 'zalo_pay')}
          >
            <FontAwesome5 name="mobile-alt" size={24} color="#0068FF" />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentText}>Thanh toán bằng ZaloPay</Text>
              <Text style={styles.paymentSubtext}>Ví kỹ thuật số an toàn</Text>
            </View>
            {orderData.payment_method === 'zalo_pay' && (
              <Feather name="check-circle" size={20} color={Colors.success} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              orderData.payment_method === 'cash_on_delivery' && styles.selectedPayment
            ]}
            onPress={() => handleInputChange('payment_method', 'cash_on_delivery')}
          >
            <MaterialIcons name="money" size={24} color={Colors.success} />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
              <Text style={styles.paymentSubtext}>Thanh toán khi nhận hàng</Text>
            </View>
            {orderData.payment_method === 'cash_on_delivery' && (
              <Feather name="check-circle" size={20} color={Colors.success} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú đơn hàng (Tùy chọn)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={orderData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Có bất kỳ hướng dẫn đặc biệt nào cho đơn hàng của bạn không..."
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mặt hàng ({orderItems.length})</Text>
            <Text style={styles.summaryValue}>
              {new Intl.NumberFormat('vi-VN').format(totalAmount)} VND
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>
              {new Intl.NumberFormat('vi-VN').format(shippingFee)} VND
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {new Intl.NumberFormat('vi-VN').format(totalAmount + shippingFee)} VND
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={createOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
          Đặt hàng - {new Intl.NumberFormat('vi-VN').format(totalAmount + shippingFee)} VND
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteBgColor,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  section: {
    backgroundColor: Colors.whiteColor,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.blackColor,
  },
  orderItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blackColor,
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemTotal: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemTotalText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.blackColor,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.blackColor,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    color: Colors.blackColor,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.blackColor,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    backgroundColor: Colors.whiteColor,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  // Shipping method styles
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.whiteColor,
  },
  selectedShipping: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shippingDetails: {
    marginLeft: 12,
    flex: 1,
  },
  shippingName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 2,
  },
  shippingTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shippingRight: {
    alignItems: 'flex-end',
  },
  shippingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  // Enhanced payment method styles
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default OrderScreen;