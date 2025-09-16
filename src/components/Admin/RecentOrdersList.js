import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const RecentOrdersList = ({ orders = [] }) => {
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} activeOpacity={0.7}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.order_id || item.id || 'N/A'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
          <FontAwesome5
            name={getStatusIcon(item.status)}
            size={12}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>VND {item.total_price || item.total_amount || '0'}</Text>
        <Text style={styles.orderDate}>{item.created_at}</Text>
      </View>
    </TouchableOpacity>
  );

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="shopping-bag" size={48} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>No recent orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => (item.order_id || item.id || Math.random()).toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItem: {
    paddingVertical: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    textTransform: "capitalize",
  },
  customerName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.success,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    opacity: 0.3,
    marginVertical: 8,
  },
  emptyContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});

export default RecentOrdersList;