import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
    Dimensions,
} from "react-native";
import {
    Feather,
    MaterialIcons,
    FontAwesome5,
} from "react-native-vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";

const { width } = Dimensions.get("window");

const ReportsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [dateRange, setDateRange] = useState("7days"); // 7days, 30days, 90days

    // Report data states
    const [salesData, setSalesData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        growthRate: 0,
    });

    const [customerData, setCustomerData] = useState({
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        customerRetentionRate: 0,
    });

    const [productData, setProductData] = useState({
        totalProducts: 0,
        topSellingProducts: [],
        lowStockProducts: [],
        categoryPerformance: [],
    });

    const [overviewStats, setOverviewStats] = useState([]);

    useEffect(() => {
        fetchReportsData();
    }, [dateRange]);

    const fetchReportsData = async (refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else setLoading(true);

            const endDate = new Date().toISOString().split("T")[0];
            const startDate = new Date();

            switch (dateRange) {
                case "7days":
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case "30days":
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                case "90days":
                    startDate.setDate(startDate.getDate() - 90);
                    break;
            }

            const startDateStr = startDate.toISOString().split("T")[0];

            // Fetch all reports data using optimized APIs
            const [
                dashboardReport,
                revenueReport,
                salesReport,
                customerReport,
                productReport,
            ] = await Promise.allSettled([
                apiService.getDashboardStats(startDateStr, endDate),
                apiService.getOrderRevenue(startDateStr, endDate),
                apiService.getSalesReport(startDateStr, endDate),
                apiService.getCustomerReport(startDateStr, endDate),
                apiService.getProductReport(startDateStr, endDate),
            ]);

            // Process dashboard data for overview tab
            if (
                dashboardReport.status === "fulfilled" &&
                dashboardReport.value.status === 200
            ) {
                const dashData = dashboardReport.value.data.data;
                const overviewData = [
                    {
                        title: "Tổng số khách hàng",
                        value: dashData.total_customers || 0,
                        icon: "users",
                        iconType: "Feather",
                        color: Colors.primary,
                        change: "+12%",
                    },
                    {
                        title: "Tổng số nhân viên",
                        value: dashData.total_staff || 0,
                        icon: "user-friends",
                        iconType: "FontAwesome5",
                        color: Colors.secondary,
                        change: "+2%",
                    },
                    {
                        title: "Tổng sản phẩm",
                        value: dashData.total_products || 0,
                        icon: "package",
                        iconType: "Feather",
                        color: Colors.warning,
                        change: "+8%",
                    },
                    {
                        title: "Tổng số đơn hàng",
                        value: dashData.total_orders || 0,
                        icon: "shopping-bag",
                        iconType: "Feather",
                        color: Colors.success,
                        change: "+25%",
                    },
                    {
                        title: "Giỏ hàng đang hoạt động",
                        value: dashData.total_carts || 0,
                        icon: "shopping-cart",
                        iconType: "Feather",
                        color: Colors.info,
                        change: "-5%",
                    },
                    {
                        title: "Doanh thu",
                        value: `${new Intl.NumberFormat("vi-VN").format(
                            dashData.revenue?.total_revenue || 0
                        )} VND`,
                        icon: "dollar-sign",
                        iconType: "Feather",
                        color: Colors.success,
                        change: "+18%",
                    },
                ];
                setOverviewStats(overviewData);
            }

            // Process revenue data for sales tab
            if (
                revenueReport.status === "fulfilled" &&
                revenueReport.value.status === 200
            ) {
                const revenueData = revenueReport.value.data.data;
                setSalesData({
                    totalRevenue: revenueData.total_revenue || 0,
                    totalOrders: revenueData.total_orders || 0,
                    averageOrderValue: revenueData.average_order_value || 0,
                    growthRate: 0, // Calculate if you have previous period data
                    revenueByStatus: revenueData.revenue_by_status || [],
                });
            }

            // Process customer data with correct key mapping
            if (
                customerReport.status === "fulfilled" &&
                customerReport.value.status === 200
            ) {
                const custData = customerReport.value.data;
                const totalCustomers = custData.summary?.total_customers || custData.totalCustomers || 0;
                const newCustomers = custData.summary?.new_customers || custData.newCustomers || 0;
                const returningCustomers = custData.summary?.returning_customers || custData.returningCustomers || 0;
                
                // Calculate retention rate client-side
                const retentionRate = totalCustomers > 0 
                    ? Math.round((returningCustomers / totalCustomers) * 100) 
                    : 0;
                
                setCustomerData({
                    totalCustomers,
                    newCustomers,
                    returningCustomers,
                    customerRetentionRate: retentionRate,
                });
            }

            // Process product data
            if (
                productReport.status === "fulfilled" &&
                productReport.value.status === 200
            ) {
                const prodData = productReport.value.data;
                setProductData({
                    totalProducts: prodData.totalProducts || 0,
                    topSellingProducts: prodData.topSellingProducts || [],
                    lowStockProducts: [], // Not available from backend yet
                    categoryPerformance: [], // Not available from backend yet
                });
            }
        } catch (error) {
            console.error("Error fetching reports data:", error);
            Alert.alert("Error", "Failed to load reports data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // This function is no longer needed as we use the single dashboard API
    // Keeping for backwards compatibility if needed
    const fetchDashboardStats = async (startDateStr, endDate) => {
        console.log("fetchDashboardStats is deprecated. Use getDashboardStats API instead.");
        return [];
    };

    const handleRefresh = () => {
        fetchReportsData(true);
    };

    const handleExportReport = () => {
        Alert.alert("Export Report", "Choose export format:", [
            { text: "Cancel", style: "cancel" },
            { text: "PDF", onPress: () => exportToPDF() },
            { text: "Excel", onPress: () => exportToExcel() },
        ]);
    };

    const exportToPDF = () => {
        Alert.alert("Info", "PDF export functionality not implemented yet");
    };

    const exportToExcel = () => {
        Alert.alert("Info", "Excel export functionality not implemented yet");
    };

    const renderIcon = (iconName, iconType, color, size = 24) => {
        const iconProps = { name: iconName, size, color };

        switch (iconType) {
            case "MaterialIcons":
                return <MaterialIcons {...iconProps} />;
            case "FontAwesome5":
                return <FontAwesome5 {...iconProps} />;
            default:
                return <Feather {...iconProps} />;
        }
    };

    const renderStatCard = (stat, index) => (
        <View key={index} style={styles.statCard}>
            <View
                style={[
                    styles.statIcon,
                    { backgroundColor: stat.color + "20" },
                ]}
            >
                {renderIcon(stat.icon, stat.iconType, stat.color, 24)}
            </View>
            <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text
                    style={[
                        styles.statChange,
                        {
                            color: stat.change.startsWith("+")
                                ? Colors.success
                                : Colors.error,
                        },
                    ]}
                >
                    {stat.change}
                </Text>
            </View>
        </View>
    );

    const renderDateRangeSelector = () => (
        <View style={styles.dateRangeContainer}>
            {[
                { key: "7days", label: "7 ngày" },
                { key: "30days", label: "30 ngày" },
                { key: "90days", label: "90 ngày" },
            ].map((range) => (
                <TouchableOpacity
                    key={range.key}
                    style={[
                        styles.dateRangeButton,
                        dateRange === range.key && styles.activeDateRangeButton,
                    ]}
                    onPress={() => setDateRange(range.key)}
                >
                    <Text
                        style={[
                            styles.dateRangeText,
                            dateRange === range.key &&
                                styles.activeDateRangeText,
                        ]}
                    >
                        {range.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderTabSelector = () => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false} 
    contentContainerStyle={styles.tabContainer}
  >
    {[
      { key: "overview", label: "Tổng quan", icon: "bar-chart" },
      { key: "sales", label: "Việc bán hàng", icon: "trending-up" },
      { key: "customers", label: "Khách hàng", icon: "users" },
      { key: "products", label: "Các sản phẩm", icon: "package" },
    ].map((tab) => (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabButton,
          activeTab === tab.key && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab(tab.key)}
      >
        <Feather
          name={tab.icon}
          size={16}
          color={
            activeTab === tab.key
              ? Colors.whiteColor
              : Colors.textSecondary
          }
        />
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

    const renderOverviewTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Tổng quan về doanh nghiệp</Text>
            <View style={styles.statsGrid}>
                {overviewStats.map((stat, index) =>
                    renderStatCard(stat, index)
                )}
            </View>
        </View>
    );

    const renderSalesTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Sales Analytics</Text>

            <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {new Intl.NumberFormat("vi-VN").format(
                            salesData.totalRevenue
                        )}{" "}
                        VND
                    </Text>
                    <Text style={styles.metricLabel}>Total Revenue</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {salesData.totalOrders}
                    </Text>
                    <Text style={styles.metricLabel}>Total Orders</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {new Intl.NumberFormat("vi-VN").format(
                            salesData.averageOrderValue
                        )}{" "}
                        VND
                    </Text>
                    <Text style={styles.metricLabel}>
                        Giá trị đơn hàng trung bình
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text
                        style={[
                            styles.metricValue,
                            {
                                color:
                                    salesData.growthRate >= 0
                                        ? Colors.success
                                        : Colors.error,
                            },
                        ]}
                    >
                        {salesData.growthRate >= 0 ? "+" : ""}
                        {salesData.growthRate}%
                    </Text>
                    <Text style={styles.metricLabel}>Tốc độ tăng trưởng</Text>
                </View>
            </View>

            {/* Revenue breakdown by status if available */}
            {salesData.revenueByStatus && salesData.revenueByStatus.length > 0 && (
                <View style={styles.productSection}>
                    <Text style={styles.subsectionTitle}>
                        Doanh thu theo trạng thái đơn hàng
                    </Text>
                    {salesData.revenueByStatus.map((status, index) => (
                        <View key={index} style={styles.productItem}>
                            <Text style={styles.productName}>
                                {status.order_status.toUpperCase()} ({status.count} orders)
                            </Text>
                            <Text style={styles.productSales}>
                                {new Intl.NumberFormat("vi-VN").format(
                                    parseFloat(status.revenue)
                                )}{" "}
                                VND
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.chartPlaceholder}>
                <Feather
                    name="bar-chart-2"
                    size={48}
                    color={Colors.textSecondary}
                />
                <Text style={styles.chartPlaceholderText}>
                    Biểu đồ doanh số
                </Text>
                <Text style={styles.chartPlaceholderSubtext}>
                    Việc trực quan hóa biểu đồ sẽ được thực hiện tại đây.
                </Text>
            </View>
        </View>
    );

    const renderCustomersTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Phân tích khách hàng</Text>
            <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {customerData.totalCustomers}
                    </Text>
                    <Text style={styles.metricLabel}>Tổng số khách hàng</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {customerData.newCustomers}
                    </Text>
                    <Text style={styles.metricLabel}>Khách hàng mới</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {customerData.returningCustomers}
                    </Text>
                    <Text style={styles.metricLabel}>Trở về</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {customerData.customerRetentionRate}%
                    </Text>
                    <Text style={styles.metricLabel}>Tỷ lệ giữ chân</Text>
                </View>
            </View>
            
            <View style={styles.chartPlaceholder}>
                <Feather
                    name="pie-chart"
                    size={48}
                    color={Colors.textSecondary}
                />
                <Text style={styles.chartPlaceholderText}>
                    Phân phối cho khách hàng
                </Text>
                <Text style={styles.chartPlaceholderSubtext}>
                    Biểu đồ phân tích khách hàng sẽ được hiển thị tại đây.
                </Text>
            </View>
        </View>
    );

    const renderProductsTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Phân tích sản phẩm</Text>

            <View style={styles.productSection}>
                <Text style={styles.subsectionTitle}>
                    Sản phẩm bán chạy nhất
                </Text>
                {productData.topSellingProducts.length === 0 ? (
                    <Text style={styles.emptyText}>No data available</Text>
                ) : (
                    productData.topSellingProducts.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                            <Text style={styles.productName}>
                                {product.name}
                            </Text>
                            <Text style={styles.productSales}>
                                {product.sales} sold
                            </Text>
                        </View>
                    ))
                )}
            </View>

            {/* Low stock products section removed - not available from backend yet */}

            <View style={styles.chartPlaceholder}>
                <Feather
                    name="trending-up"
                    size={48}
                    color={Colors.textSecondary}
                />
                <Text style={styles.chartPlaceholderText}>
                    Hiệu suất sản phẩm
                </Text>
                <Text style={styles.chartPlaceholderSubtext}>
                    Biểu đồ phân tích sản phẩm sẽ được hiển thị tại đây.
                </Text>
            </View>
        </View>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case "sales":
                return renderSalesTab();
            case "customers":
                return renderCustomersTab();
            case "products":
                return renderProductsTab();
            default:
                return renderOverviewTab();
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Báo cáo & Phân tích</Text>
                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={handleExportReport}
                    >
                        <Feather
                            name="download"
                            size={20}
                            color={Colors.primary}
                        />
                        <Text style={styles.exportButtonText}>Xuất file</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Range Selector */}
                {renderDateRangeSelector()}

                {/* Tab Selector */}
                {renderTabSelector()}

                {/* Active Tab Content */}
                {renderActiveTab()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteBgColor,
    },
    scrollContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.whiteBgColor,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.blackColor,
    },
    exportButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.primary + "20",
        borderRadius: 6,
    },
    exportButtonText: {
        marginLeft: 6,
        fontSize: 14,
        color: Colors.primary,
        fontWeight: "500",
    },
    dateRangeContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dateRangeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.grayBgColor,
        borderRadius: 20,
        marginRight: 8,
    },
    activeDateRangeButton: {
        backgroundColor: Colors.primary,
    },
    dateRangeText: {
        fontSize: 14,
        color: Colors.blackColor,
        fontWeight: "500",
    },
    activeDateRangeText: {
        color: Colors.whiteColor,
    },
    tabContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    tabButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.grayBgColor,
        borderRadius: 20,
        marginRight: 8,
    },
    activeTabButton: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        marginLeft: 4,
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: "500",
    },
    activeTabText: {
        color: Colors.whiteColor,
    },
    tabContent: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: Colors.blackColor,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statCard: {
        width: (width - 48) / 2,
        backgroundColor: Colors.whiteColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statInfo: {
        alignItems: "flex-start",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.blackColor,
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    statChange: {
        fontSize: 12,
        fontWeight: "600",
    },
    metricsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    metricCard: {
        width: (width - 48) / 2,
        backgroundColor: Colors.whiteColor,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.blackColor,
        marginBottom: 6,
    },
    metricLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center",
    },
    chartPlaceholder: {
        backgroundColor: Colors.whiteColor,
        borderRadius: 12,
        padding: 40,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartPlaceholderText: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.blackColor,
        marginTop: 12,
    },
    chartPlaceholderSubtext: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center",
        marginTop: 6,
    },
    productSection: {
        backgroundColor: Colors.whiteColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.blackColor,
        marginBottom: 12,
    },
    productItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
    },
    productName: {
        fontSize: 14,
        color: Colors.blackColor,
        flex: 1,
    },
    productSales: {
        fontSize: 14,
        color: Colors.success,
        fontWeight: "500",
    },
    productStock: {
        fontSize: 14,
        fontWeight: "500",
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center",
        paddingVertical: 20,
    },
});

export default ReportsScreen;
