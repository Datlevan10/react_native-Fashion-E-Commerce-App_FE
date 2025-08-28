import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import ApiService from "../../api/ApiService";
import Colors from "../../styles/Color";

const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const customer_id = await SecureStore.getItemAsync("customer_id");
      
      if (!customer_id) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const response = await ApiService.getCustomerOrders(customer_id);
      
      if (response.status === 200 && response.data?.data) {
        // Sort orders by date (newest first)
        const sortedOrders = response.data.data.sort((a, b) => 
          new Date(b.order_date) - new Date(a.order_date)
        );
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 404) {
        setOrders([]);
      } else {
        setError("Failed to load orders");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: "clock",
      confirmed: "check-circle",
      processing: "settings",
      shipped: "truck",
      delivered: "package",
      completed: "check-square",
      cancelled: "x-circle",
      refunded: "rotate-ccw"
    };
    return statusIcons[status?.toLowerCase()] || "help-circle";
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: item.order_id })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID:</Text>
          <Text style={styles.orderIdValue}>{item.order_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.order_status) }]}>
          <Feather 
            name={getStatusIcon(item.order_status)} 
            size={14} 
            color="white" 
          />
          <Text style={styles.statusText}>{item.order_status?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color={Colors.darkGray} />
            <Text style={styles.infoText}>{formatDate(item.order_date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Feather name="credit-card" size={16} color={Colors.darkGray} />
            <Text style={styles.infoText}>{item.payment_method || 'Not specified'}</Text>
          </View>
          
          {item.shipping_address && (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={Colors.darkGray} />
              <Text style={styles.infoText} numberOfLines={2}>
                {item.shipping_address}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.totalPrice}>{formatPrice(item.total_price)}</Text>
          {item.discount > 0 && (
            <Text style={styles.discountText}>
              Discount: {item.discount}%
            </Text>
          )}
        </View>
      </View>

      <View style={styles.orderFooter}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: item.order_id })}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Feather name="chevron-right" size={16} color={Colors.blackColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color={Colors.lightGray} />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        You haven't placed any orders yet. Start shopping to see your orders here!
      </Text>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={60} color="#ff4757" />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={loading}>
            <Feather 
              name="refresh-cw" 
              size={24} 
              color={loading ? Colors.lightGray : Colors.blackColor} 
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.blackColor} />
            <Text style={styles.loadingText}>Loading your orders...</Text>
          </View>
        ) : error ? (
          renderError()
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.order_id}
            contentContainerStyle={[
              styles.listContainer,
              orders.length === 0 && styles.emptyListContainer
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.blackColor]}
              />
            }
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
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
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  orderIdValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  orderBody: {
    flexDirection: "row",
    padding: 16,
  },
  orderInfo: {
    flex: 1,
    marginRight: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 8,
    flex: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.blackColor,
  },
  discountText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 4,
  },
  orderFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.blackColor,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
    marginRight: 8,
  },
  // Empty, Error, Loading States
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.blackColor,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  shopButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "600",
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
});

export default MyOrdersScreen;