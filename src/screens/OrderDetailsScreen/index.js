import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import ApiService from "../../api/ApiService";
import Colors from "../../styles/Color";
import API_BASE_URL from "../../configs/config";

const { width } = Dimensions.get("window");

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await ApiService.getOrderDetailsByOrderId(orderId);
      
      if (response.data.order_details && response.data.order_details.length > 0) {
        // Transform order details for display
        const orderData = {
          order_id: orderId,
          order_items: response.data.order_details.map(detail => ({
            product: {
              product_name: detail.product_name,
              image_url: detail.image
            },
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            total_price: detail.total_price,
            color: detail.color,
            size: detail.size
          })),
          customer_name: response.data.order_details[0].customer_name,
          staff_name: response.data.order_details[0].staff_name,
          total_price: response.data.order_details.reduce((sum, item) => 
            sum + parseFloat(item.total_price || 0), 0
          ),
          order_status: 'pending', // Default status
          order_date: response.data.order_details[0].created_at,
          created_at: response.data.order_details[0].created_at
        };
        
        setOrderDetails(orderData);
      } else {
        setError("Order details not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      console.error("Error response:", error.response?.data);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "#FF9800",
      confirmed: "#2196F3",
      processing: "#9C27B0",
      shipped: "#607D8B",
      delivered: "#4CAF50",
      completed: "#4CAF50",
      cancelled: "#f44336",
      refunded: "#795548"
    };
    return statusColors[status?.toLowerCase()] || "#999";
  };

  const getStatusSteps = (currentStatus) => {
    const allSteps = [
      { key: 'pending', label: 'Order Placed', icon: 'check-circle' },
      { key: 'confirmed', label: 'Confirmed', icon: 'check-circle' },
      { key: 'processing', label: 'Processing', icon: 'settings' },
      { key: 'shipped', label: 'Shipped', icon: 'truck' },
      { key: 'delivered', label: 'Delivered', icon: 'package' }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng này?",
      [
        {
          text: "Không",
          style: "cancel"
        },
        {
          text: "Hủy đơn hàng",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.cancelOrder(orderId);
              Alert.alert("Thành công", "Đơn hàng đã được hủy thành công");
              fetchOrderDetails(); // Refresh data
            } catch (error) {
              console.error("Error cancelling order:", error);
              Alert.alert("Lỗi", "Không thể hủy đơn hàng");
            }
          }
        }
      ]
    );
  };

  const renderStatusTracker = () => {
    if (!orderDetails) return null;
    
    const steps = getStatusSteps(orderDetails.order_status);
    
    return (
      <View style={styles.statusTracker}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusContainer}>
          {steps.map((step, index) => (
            <View key={step.key} style={styles.statusStep}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: step.completed ? getStatusColor(step.key) : Colors.lightGray }
                ]}>
                  <Feather 
                    name={step.icon} 
                    size={16} 
                    color={step.completed ? "white" : Colors.darkGray} 
                  />
                </View>
                {index < steps.length - 1 && (
                  <View style={[
                    styles.statusLine,
                    { backgroundColor: step.completed ? getStatusColor(step.key) : Colors.lightGray }
                  ]} />
                )}
              </View>
              <Text style={[
                styles.statusLabel,
                { color: step.completed ? Colors.blackColor : Colors.darkGray }
              ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderOrderInfo = () => {
    if (!orderDetails) return null;

    return (
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{orderDetails.order_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date:</Text>
            <Text style={styles.infoValue}>{formatDate(orderDetails.order_date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>{orderDetails.payment_method || 'Not specified'}</Text>
          </View>
          {orderDetails.shipping_address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shipping Address:</Text>
              <Text style={styles.infoValue}>{orderDetails.shipping_address}</Text>
            </View>
          )}
          {orderDetails.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.infoValue}>{orderDetails.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderOrderItems = () => {
    if (!orderDetails?.order_items || orderDetails.order_items.length === 0) {
      return (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <Text style={styles.noItemsText}>No items found for this order</Text>
        </View>
      );
    }

    return (
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {orderDetails.order_items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemImageContainer}>
              {item.product?.image_url ? (
                <Image 
                  source={{ uri: `${API_BASE_URL}${item.product.image_url}` }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialIcons name="image" size={40} color={Colors.lightGray} />
                </View>
              )}
            </View>
            
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.product?.product_name || 'Product Name'}
              </Text>
              <View style={styles.itemSpecs}>
                <Text style={styles.itemSpec}>Qty: {item.quantity}</Text>
                <Text style={styles.itemSpec}>Price: {formatPrice(item.unit_price)}</Text>
              </View>
              <Text style={styles.itemTotal}>
                Total: {formatPrice(item.total_price)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPriceSummary = () => {
    if (!orderDetails) return null;

    const subtotal = parseFloat(orderDetails.total_price) - (parseFloat(orderDetails.shipping_fee) || 0);
    const discount = orderDetails.discount || 0;

    return (
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Price Summary</Text>
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
          </View>
          
          {orderDetails.shipping_fee && parseFloat(orderDetails.shipping_fee) > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping Fee:</Text>
              <Text style={styles.priceValue}>{formatPrice(orderDetails.shipping_fee)}</Text>
            </View>
          )}
          
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount ({discount}%):</Text>
              <Text style={[styles.priceValue, { color: '#4CAF50' }]}>
                -{formatPrice(subtotal * (discount / 100))}
              </Text>
            </View>
          )}
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatPrice(orderDetails.total_price)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={60} color="#ff4757" />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={fetchOrderDetails} style={styles.retryButton}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.blackColor} />
      <Text style={styles.loadingText}>Loading order details...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <TouchableOpacity onPress={fetchOrderDetails} disabled={loading}>
            <Feather 
              name="refresh-cw" 
              size={24} 
              color={loading ? Colors.lightGray : Colors.blackColor} 
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? renderLoading() : error ? renderError() : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {renderStatusTracker()}
            {renderOrderInfo()}
            {renderOrderItems()}
            {renderPriceSummary()}
            
            {/* Action Buttons */}
            {orderDetails && ['pending', 'confirmed'].includes(orderDetails.order_status?.toLowerCase()) && (
              <View style={styles.actionSection}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelOrder}
                >
                  <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.whiteColor,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.blackColor,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  
  // Status Tracker
  statusTracker: {
    backgroundColor: Colors.whiteColor,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusContainer: {
    marginTop: 16,
  },
  statusStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  statusDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statusLine: {
    width: 2,
    height: 30,
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  
  // Info Section
  infoSection: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.blackColor,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.darkGray,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.blackColor,
    flex: 2,
    textAlign: "right",
  },
  
  // Order Items
  noItemsText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    padding: 40,
  },
  orderItem: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
    marginRight: 16,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
    marginBottom: 8,
  },
  itemSpecs: {
    flexDirection: "row",
    marginBottom: 8,
  },
  itemSpec: {
    fontSize: 14,
    color: Colors.darkGray,
    marginRight: 16,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.blackColor,
  },
  
  // Price Summary
  priceCard: {
    padding: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    marginTop: 12,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.blackColor,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.blackColor,
  },
  
  // Action Section
  actionSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "700",
  },
  
  // States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.blackColor,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default OrderDetailsScreen;