import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import OrderCard from "../../components/Admin/OrderCard";
import OrderFilters from "../../components/Admin/OrderFilters";

export default function OrderManagementScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    sortBy: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage, filters]);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const fetchOrdersData = async () => {
    try {
      setLoading(currentPage === 1);
      const filterParams = {};
      
      if (filters.status !== "all") {
        filterParams.status = filters.status;
      }
      
      if (filters.dateRange !== "all") {
        filterParams.date_range = filters.dateRange;
      }
      
      if (filters.sortBy !== "newest") {
        filterParams.sort_by = filters.sortBy;
      }

      const response = await apiService.getAllOrders(currentPage, 20, filterParams);
      const newOrders = response.data.orders || [];
      
      if (currentPage === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }
      
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders data:", error);
      Alert.alert("Error", "Failed to fetch orders data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchOrdersData();
  };

  const loadMoreOrders = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) =>
      order.id.toString().includes(searchQuery) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    Alert.alert(
      "Confirm Status Update",
      `Are you sure you want to update this order to ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            try {
              await apiService.updateOrderStatus(orderId, newStatus);
              setOrders(orders.map(order => 
                order.id === orderId 
                  ? { ...order, status: newStatus }
                  : order
              ));
              Alert.alert("Success", "Order status updated successfully");
            } catch (error) {
              console.error("Error updating order status:", error);
              Alert.alert("Error", "Failed to update order status");
            }
          },
        },
      ]
    );
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getOrderStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const renderOrderCard = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() =>
        navigation.navigate("OrderDetailsScreen", { orderId: item.id })
      }
      onStatusUpdate={(status) => handleUpdateOrderStatus(item.id, status)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="filter" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order ID, customer name or email..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <OrderFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getOrderStatusCount("pending")}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getOrderStatusCount("confirmed")}</Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getOrderStatusCount("delivered")}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading || currentPage === 1) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Loading more orders...</Text>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="shopping-bag" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? "Try adjusting your search criteria" : "No orders placed yet"}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a73e8", "#e3f2fd"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmptyList : null}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.1}
        />
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
  listContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.whiteColor,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  loadingFooter: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});