import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import DashboardMetricCard from "../../components/Admin/DashboardMetricCard";
import QuickActionCard from "../../components/Admin/QuickActionCard";
import RecentOrdersList from "../../components/Admin/RecentOrdersList";
import SalesChart from "../../components/Admin/SalesChart";
import OrderStatusChart from "../../components/Admin/OrderStatusChart";

const { width } = Dimensions.get("window");

export default function AdminDashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalCarts: 0,
    activeCarts: 0,
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all dashboard metrics
      const [
        customersRes,
        staffRes,
        productsRes,
        categoriesRes,
        cartsRes,
        activeCartsRes,
        ordersRes,
        recentOrdersRes,
        topProductsRes,
      ] = await Promise.all([
        apiService.getTotalCustomers(),
        apiService.getTotalStaff(),
        apiService.getTotalProducts(),
        apiService.getTotalCategories(),
        apiService.getTotalCarts(),
        apiService.getActiveCarts(),
        apiService.getOrderStatistics(),
        apiService.getRecentOrders(10),
        apiService.getTopProducts(5),
      ]);

      setDashboardData({
        totalCustomers: customersRes.data.data.total || 0,
        totalStaff: staffRes.data.data.total || 0,
        totalProducts: productsRes.data.data.total || 0,
        totalCategories: categoriesRes.data.data.total || 0,
        totalCarts: cartsRes.data.data.total || 0,
        activeCarts: activeCartsRes.data.data.active || 0,
        todayOrders: ordersRes.data.today || 0,
        weekOrders: ordersRes.data.week || 0,
        monthOrders: ordersRes.data.month || 0,
        todayRevenue: ordersRes.data.todayRevenue || 0,
        weekRevenue: ordersRes.data.weekRevenue || 0,
        monthRevenue: ordersRes.data.monthRevenue || 0,
      });

      setRecentOrders(recentOrdersRes.data.orders || []);
      setTopProducts(topProductsRes.data.products || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values if API calls fail
      setDashboardData({
        totalCustomers: 0,
        totalStaff: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalCarts: 0,
        activeCarts: 0,
        todayOrders: 0,
        weekOrders: 0,
        monthOrders: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Xem đơn hàng",
      icon: "shopping-bag",
      iconType: "Feather",
      color: Colors.primary,
      onPress: () => navigation.navigate("OrderManagementScreen"),
    },
    {
      title: "Quản lý nhân viên",
      icon: "users",
      iconType: "Feather",
      color: Colors.secondary,
      onPress: () => navigation.navigate("StaffManagementScreen"),
    },
    {
      title: "Khách hàng",
      icon: "user-friends",
      iconType: "FontAwesome5",
      color: Colors.warning,
      onPress: () => navigation.navigate("CustomerManagementScreen"),
    },
    {
      title: "Các sản phẩm",
      icon: "package",
      iconType: "Feather",
      color: Colors.blueProduct,
      onPress: () => navigation.navigate("ProductManagementScreen"),
    },
    {
      title: "Báo cáo",
      icon: "bar-chart",
      iconType: "Feather",
      color: "#9c27b0",
      onPress: () => navigation.navigate("ReportsScreen"),
    },
    {
      title: "Cài đặt",
      icon: "settings",
      iconType: "Feather",
      color: Colors.textSecondary,
      onPress: () => navigation.navigate("AdminSettingsScreen"),
    },
  ];

  if (loading) {
    return (
      <LinearGradient
        colors={["#1a73e8", "#4285f4"]}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Đang tải Bảng điều khiển...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a73e8", "#e3f2fd"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bảng điều khiển</Text>
            <Text style={styles.headerSubtitle}>Chào mừng trở lại, Admin!</Text>
          </View>

          {/* Metrics Cards */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricsRow}>
              <DashboardMetricCard
                title="Tổng số khách hàng"
                value={dashboardData.totalCustomers}
                icon="users"
                iconType="Feather"
                color={Colors.primary}
                style={styles.metricCard}
              />
              <DashboardMetricCard
                title="Tổng số nhân viên"
                value={dashboardData.totalStaff}
                icon="user-check"
                iconType="Feather"
                color={Colors.secondary}
                style={styles.metricCard}
              />
            </View>
            <View style={styles.metricsRow}>
              <DashboardMetricCard
                title="Tổng sản phẩm"
                value={dashboardData.totalProducts}
                icon="package"
                iconType="Feather"
                color={Colors.warning}
                style={styles.metricCard}
              />
              <DashboardMetricCard
                title="Danh mục"
                value={dashboardData.totalCategories}
                icon="grid"
                iconType="Feather"
                color={Colors.blueProduct}
                style={styles.metricCard}
              />
            </View>
            <View style={styles.metricsRow}>
              <DashboardMetricCard
                title="Tổng số giỏ hàng"
                value={dashboardData.totalCarts}
                icon="shopping-cart"
                iconType="Feather"
                color={Colors.info}
                style={styles.metricCard}
              />
              <DashboardMetricCard
                title="Giỏ hàng đang hoạt động"
                value={dashboardData.activeCarts}
                icon="shopping-bag"
                iconType="Feather"
                color={Colors.warning}
                style={styles.metricCard}
              />
            </View>
          </View>

          {/* Revenue Cards */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tổng quan về doanh thu</Text>
            <View style={styles.revenueContainer}>
              <DashboardMetricCard
                title="Doanh thu hôm nay"
                value={`VND ${dashboardData.todayRevenue.toLocaleString()}`}
                icon="dollar-sign"
                iconType="Feather"
                color={Colors.success}
                style={styles.revenueCard}
              />
              <DashboardMetricCard
                title="Tuần này"
                value={`VND ${dashboardData.weekRevenue.toLocaleString()}`}
                icon="trending-up"
                iconType="Feather"
                color={Colors.primary}
                style={styles.revenueCard}
              />
              <DashboardMetricCard
                title="Tháng này"
                value={`VND ${dashboardData.monthRevenue.toLocaleString()}`}
                icon="calendar"
                iconType="Feather"
                color={Colors.secondary}
                style={styles.revenueCard}
              />
            </View>
          </View>

          {/* Orders Overview */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tổng quan đơn hàng</Text>
            <View style={styles.ordersContainer}>
              <View style={styles.orderCard}>
                <Text style={styles.orderCardTitle}>Hôm nay</Text>
                <Text style={styles.orderCardValue}>{dashboardData.todayOrders}</Text>
              </View>
              <View style={styles.orderCard}>
                <Text style={styles.orderCardTitle}>Tuần này</Text>
                <Text style={styles.orderCardValue}>{dashboardData.weekOrders}</Text>
              </View>
              <View style={styles.orderCard}>
                <Text style={styles.orderCardTitle}>Tháng này</Text>
                <Text style={styles.orderCardValue}>{dashboardData.monthOrders}</Text>
              </View>
            </View>
          </View>

          {/* Charts Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Phân tích</Text>
            <SalesChart />
            <OrderStatusChart />
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Hành động nhanh</Text>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  icon={action.icon}
                  iconType={action.iconType}
                  color={action.color}
                  onPress={action.onPress}
                  style={styles.quickActionCard}
                />
              ))}
            </View>
          </View>

          {/* Recent Orders */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("OrderManagementScreen")}
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <RecentOrdersList orders={recentOrders} />
          </View>
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
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.8,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricCard: {
    width: (width - 50) / 2,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  revenueCard: {
    width: (width - 60) / 3,
    marginBottom: 10,
  },
  ordersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: (width - 60) / 3,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  orderCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
  },
});