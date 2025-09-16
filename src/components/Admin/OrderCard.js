import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const OrderCard = ({ order, onPress, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return Colors.warning;
      case "confirmed":
        return Colors.blueProduct;
      case "shipped":
        return Colors.primary;
      case "delivered":
        return Colors.success;
      case "cancelled":
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "clock";
      case "confirmed":
        return "check-circle";
      case "shipped":
        return "truck";
      case "delivered":
        return "check-double";
      case "cancelled":
        return "times-circle";
      default:
        return "question-circle";
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "confirmed",
      confirmed: "shipped",
      shipped: "delivered",
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus?.toLowerCase()];
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Mã đơn hàng #{order.order_id || order.id || 'N/A'}</Text>
          <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.order_status)}15` }]}>
          <FontAwesome5
            name={getStatusIcon(order.order_status)}
            size={12}
            color={getStatusColor(order.order_status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(order.order_status) }]}>
            {order.order_status}
          </Text>
        </View>
      </View>

      <View style={styles.customerSection}>
        <Feather name="user" size={14} color={Colors.textSecondary} />
        <Text style={styles.customerName}>
          {order.customer_name || order.customer?.name || `Customer ${order.customer_id}` || 'Unknown Customer'}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Feather name="package" size={14} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{order.product_count || order.total_items || 0} sản phẩm</Text>
        </View>
        <View style={styles.detailItem}>
          <Feather name="map-pin" size={14} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {order.shipping_address || "No address"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Tổng số tiền</Text>
          <Text style={styles.amountValue}>
            {order.total_price ? `VND ${parseInt(order.total_price).toLocaleString()}` : 
             order.total_amount ? `VND ${parseInt(order.total_amount).toLocaleString()}` : 'N/A'}
          </Text>
        </View>
        
        {nextStatus && order.status !== "cancelled" && (
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: getStatusColor(nextStatus) }]}
            onPress={() => onStatusUpdate(nextStatus)}
          >
            <Text style={styles.updateButtonText}>
              Mark as {nextStatus}
            </Text>
            <Feather name="chevron-right" size={16} color={Colors.whiteColor} />
          </TouchableOpacity>
        )}
      </View>

      {order.payment_method && (
        <View style={styles.paymentInfo}>
          <FontAwesome5
            name={
              order.payment_method === "zalopay" ? "mobile-alt" :
              order.payment_method === "qr_code" ? "qrcode" :
              order.payment_method === "cash_on_delivery" ? "money-bill-wave" : "credit-card"
            }
            size={12}
            color={Colors.textSecondary}
          />
          <Text style={styles.paymentText}>
            Phương thức : 
            {order.payment_method === "zalopay" ? "ZaloPay" :
             order.payment_method === "qr_code" ? "QR Code" :
             order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : 
             order.payment_method}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    borderTopOpacity: 0.2,
  },
  amountSection: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.success,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updateButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.whiteColor,
    marginRight: 4,
    textTransform: "capitalize",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    borderTopOpacity: 0.2,
  },
  paymentText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
});

export default OrderCard;