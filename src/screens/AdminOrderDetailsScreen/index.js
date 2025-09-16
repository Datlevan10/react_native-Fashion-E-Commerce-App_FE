import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import ApiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const { width } = Dimensions.get("window");

export default function AdminOrderDetailsScreen({ navigation, route }) {
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getOrderDetailsByOrderId(orderId);
      
      if (response.data.order_details && response.data.order_details.length > 0) {
        setOrderDetails(response.data.order_details);
        // Extract order info from first detail
        const firstDetail = response.data.order_details[0];
        setOrderInfo({
          order_id: orderId,
          customer_name: firstDetail.customer_name,
          staff_name: firstDetail.staff_name,
          created_at: firstDetail.created_at,
          updated_at: firstDetail.updated_at,
          total_amount: response.data.order_details.reduce((sum, item) => 
            sum + parseFloat(item.total_price || 0), 0
          ),
          product_count: response.data.order_details.length,
          total_quantity: response.data.order_details.reduce((sum, item) => 
            sum + parseInt(item.quantity || 0), 0
          )
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      setUpdating(true);
      await ApiService.updateOrderStatusAdmin(orderId, status);
      Alert.alert(
        "Thành công", 
        `Đơn hàng đã được ${status === 'confirmed' ? 'xác nhận' : 'cập nhật trạng thái'} thành công`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error updating order status (admin):", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setUpdating(true);
      await ApiService.cancelOrderAdmin(orderId);
      Alert.alert(
        "Thành công", 
        "Đơn hàng đã được hủy thành công",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error cancelling order (admin):", error);
      Alert.alert("Lỗi", "Không thể hủy đơn hàng");
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmOrder = () => {
    Alert.alert(
      "Xác nhận đơn hàng",
      "Bạn có chắc chắn muốn xác nhận đơn hàng này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xác nhận", 
          style: "default",
          onPress: () => updateOrderStatus('confirmed')
        }
      ]
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.",
      [
        { text: "Không", style: "cancel" },
        { 
          text: "Hủy đơn hàng", 
          style: "destructive",
          onPress: cancelOrder
        }
      ]
    );
  };

  const handleStatusChange = (status) => {
    const statusNames = {
      'pending': 'chờ xử lý',
      'confirmed': 'đã xác nhận', 
      'processing': 'đang xử lý',
      'shipped': 'đã gửi hàng',
      'delivered': 'đã giao hàng',
      'cancelled': 'đã hủy'
    };

    Alert.alert(
      "Cập nhật trạng thái",
      `Thay đổi trạng thái đơn hàng thành "${statusNames[status]}"?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Cập nhật", 
          onPress: () => updateOrderStatus(status)
        }
      ]
    );
  };

  const formatPrice = (price) => {
    return `VND ${parseInt(price || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image 
            source={{ uri: `${API_BASE_URL}${item.image}` }} 
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image" size={30} color={Colors.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <View style={styles.productSpecs}>
          <Text style={styles.specText}>Số lượng: {item.quantity}</Text>
          <Text style={styles.specText}>Kích cỡ: {item.size}</Text>
          <Text style={styles.specText}>Màu: {item.color}</Text>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.unitPrice}>Đơn giá: {formatPrice(item.unit_price)}</Text>
          <Text style={styles.totalPrice}>Tổng: {formatPrice(item.total_price)}</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <Text style={styles.actionTitle}>Hành động quản lý</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={handleConfirmOrder}
          disabled={updating}
        >
          <FontAwesome5 name="check-circle" size={16} color={Colors.whiteColor} />
          <Text style={styles.buttonText}>Xác nhận đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={handleCancelOrder}
          disabled={updating}
        >
          <FontAwesome5 name="times-circle" size={16} color={Colors.whiteColor} />
          <Text style={styles.buttonText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.processingButton]}
          onPress={() => handleStatusChange('processing')}
          disabled={updating}
        >
          <FontAwesome5 name="cog" size={16} color={Colors.whiteColor} />
          <Text style={styles.buttonText}>Đang xử lý</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shippedButton]}
          onPress={() => handleStatusChange('shipped')}
          disabled={updating}
        >
          <FontAwesome5 name="truck" size={16} color={Colors.whiteColor} />
          <Text style={styles.buttonText}>Đã gửi hàng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, styles.deliveredButton, { width: '100%' }]}
        onPress={() => handleStatusChange('delivered')}
        disabled={updating}
      >
        <FontAwesome5 name="check-double" size={16} color={Colors.whiteColor} />
        <Text style={styles.buttonText}>Đã giao hàng</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#1a73e8", "#4285f4"]}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a73e8", "#e3f2fd"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
          </View>

          {/* Order Summary */}
          {orderInfo && (
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Mã đơn hàng #{orderId}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Khách hàng:</Text>
                <Text style={styles.summaryValue}>{orderInfo.customer_name}</Text>
              </View>
              {orderInfo.staff_name && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Nhân viên xử lý:</Text>
                  <Text style={styles.summaryValue}>{orderInfo.staff_name}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ngày đặt:</Text>
                <Text style={styles.summaryValue}>{formatDate(orderInfo.created_at)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng sản phẩm:</Text>
                <Text style={styles.summaryValue}>{orderInfo.product_count}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng số lượng:</Text>
                <Text style={styles.summaryValue}>{orderInfo.total_quantity}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng tiền:</Text>
                <Text style={[styles.summaryValue, styles.totalAmount]}>
                  {formatPrice(orderInfo.total_amount)}
                </Text>
              </View>
            </View>
          )}

          {/* Products List */}
          <View style={styles.productsContainer}>
            <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
            {orderDetails.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="box-open" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
              </View>
            ) : (
              <FlatList
                data={orderDetails}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.order_detail_id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </View>

          {/* Action Buttons */}
          {renderActionButtons()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.whiteColor,
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: Colors.whiteColor,
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  totalAmount: {
    color: Colors.success,
    fontSize: 18,
  },
  productsContainer: {
    backgroundColor: Colors.whiteColor,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.borderColor,
    marginRight: 16,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  productSpecs: {
    flexDirection: "row",
    marginBottom: 8,
  },
  specText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 16,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.success,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    opacity: 0.3,
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
  actionSection: {
    backgroundColor: Colors.whiteColor,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
    minHeight: 48,
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: Colors.error,
  },
  processingButton: {
    backgroundColor: Colors.warning,
  },
  shippedButton: {
    backgroundColor: Colors.primary,
  },
  deliveredButton: {
    backgroundColor: Colors.blueProduct,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});