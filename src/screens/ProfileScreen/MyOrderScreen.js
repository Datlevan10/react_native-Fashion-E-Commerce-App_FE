import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    Feather,
    MaterialIcons,
    FontAwesome5,
    Ionicons,
} from "@expo/vector-icons";
import ApiService from "../../api/ApiService";
import * as SecureStore from "expo-secure-store";
import Colors from "../../styles/Color";

const { width } = Dimensions.get("window");

export default function MyOrderScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState("all");

    const tabs = [
        { id: "all", label: "Tất cả", icon: "list-alt" },
        {
            id: "pending",
            label: "Chờ xác nhận",
            icon: "clock",
            color: "#FFA500",
        },
        {
            id: "processing",
            label: "Đang xử lý",
            icon: "sync",
            color: "#2196F3",
        },
        { id: "shipped", label: "Đang giao", icon: "truck", color: "#9C27B0" },
        {
            id: "delivered",
            label: "Đã giao",
            icon: "check-circle",
            color: "#4CAF50",
        },
        {
            id: "cancelled",
            label: "Đã hủy",
            icon: "times-circle",
            color: "#F44336",
        },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const customerId = await SecureStore.getItemAsync("customer_id");
            if (customerId) {
                const response = await ApiService.getCustomerOrders(customerId);
                setOrders(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getFilteredOrders = () => {
        if (selectedTab === "all") return orders;
        return orders.filter((order) => {
            const status = order.order_status?.toLowerCase();
            if (selectedTab === "delivered") {
                return status === "delivered" || status === "completed";
            }
            return status === selectedTab;
        });
    };

    const getStatusConfig = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case "pending":
                return {
                    color: "#FFA500",
                    bgColor: "#FFF3E0",
                    text: "Chờ xác nhận",
                    icon: "clock",
                };
            case "processing":
                return {
                    color: "#2196F3",
                    bgColor: "#E3F2FD",
                    text: "Đang xử lý",
                    icon: "sync",
                };
            case "shipped":
                return {
                    color: "#9C27B0",
                    bgColor: "#F3E5F5",
                    text: "Đang giao hàng",
                    icon: "truck",
                };
            case "delivered":
            case "completed":
                return {
                    color: "#4CAF50",
                    bgColor: "#E8F5E9",
                    text: "Đã giao hàng",
                    icon: "check-circle",
                };
            case "cancelled":
                return {
                    color: "#F44336",
                    bgColor: "#FFEBEE",
                    text: "Đã hủy",
                    icon: "times-circle",
                };
            default:
                return {
                    color: "#757575",
                    bgColor: "#F5F5F5",
                    text: status || "N/A",
                    icon: "question-circle",
                };
        }
    };

    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return numAmount.toLocaleString("vi-VN") + " ₫";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderTabItem = ({ item }) => {
        const isActive = selectedTab === item.id;
        const orderCount =
            item.id === "all"
                ? orders.length
                : orders.filter((o) => {
                      const status = o.order_status?.toLowerCase();
                      if (item.id === "delivered") {
                          return (
                              status === "delivered" || status === "completed"
                          );
                      }
                      return status === item.id;
                  }).length;

        return (
            <TouchableOpacity
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setSelectedTab(item.id)}
            >
                <View style={styles.tabContent}>
                    <FontAwesome5
                        name={item.icon}
                        size={16}
                        color={isActive ? Colors.primary : "#666"}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            isActive && styles.activeTabText,
                        ]}
                    >
                        {item.label}
                    </Text>
                    {orderCount > 0 && (
                        <View
                            style={[
                                styles.tabBadge,
                                isActive && styles.activeTabBadge,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabBadgeText,
                                    isActive && styles.activeTabBadgeText,
                                ]}
                            >
                                {orderCount}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderOrderItem = ({ item }) => {
        const statusConfig = getStatusConfig(item.order_status);

        return (
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() =>
                    navigation.navigate("OrderDetailsScreen", {
                        orderId: item.order_id,
                    })
                }
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={["#fff", "#fafafa"]}
                    style={styles.gradientCard}
                >
                    {/* Order Header with Status */}
                    <View style={styles.orderHeader}>
                        <View style={styles.orderIdContainer}>
                            <View style={styles.orderIconContainer}>
                                <Ionicons
                                    name="receipt-outline"
                                    size={20}
                                    color={Colors.primary}
                                />
                            </View>
                            <View>
                                <Text style={styles.orderId}>
                                    Đơn hàng #{item.order_id}
                                </Text>
                                <Text style={styles.orderDate}>
                                    <Feather
                                        name="calendar"
                                        size={12}
                                        color="#999"
                                    />{" "}
                                    {formatDate(item.created_at)}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: statusConfig.bgColor },
                            ]}
                        >
                            <FontAwesome5
                                name={statusConfig.icon}
                                size={10}
                                color={statusConfig.color}
                                style={styles.statusIcon}
                            />
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: statusConfig.color },
                                ]}
                            >
                                {statusConfig.text}
                            </Text>
                        </View>
                    </View>

                    {/* Order Details Section */}
                    <View style={styles.orderDetails}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons
                                    name="location-on"
                                    size={18}
                                    color="#FF6B6B"
                                />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>
                                    Địa chỉ giao hàng
                                </Text>
                                <Text
                                    style={styles.detailValue}
                                    numberOfLines={2}
                                >
                                    {item.shipping_address || "Chưa có địa chỉ"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons
                                    name="payment"
                                    size={18}
                                    color="#4ECDC4"
                                />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>
                                    Phương thức thanh toán
                                </Text>
                                <Text style={styles.detailValue}>
                                    {item.payment_method === "cash_on_delivery"
                                        ? "Thanh toán khi nhận hàng"
                                        : item.payment_method === "zalopay"
                                        ? "ZaloPay"
                                        : item.payment_method}
                                </Text>
                            </View>
                        </View>

                        {/* Items Preview */}
                        {item.items_count && (
                            <View style={styles.itemsPreview}>
                                <Text style={styles.itemsCount}>
                                    <Feather
                                        name="package"
                                        size={14}
                                        color="#666"
                                    />{" "}
                                    {item.items_count} sản phẩm
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Order Footer with Price */}
                    <View style={styles.orderFooter}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.totalLabel}>
                                Tổng thanh toán
                            </Text>
                            <Text style={styles.totalAmount}>
                                {formatCurrency(item.total_price)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.viewDetailButton}>
                            <Text style={styles.viewDetailText}>Chi tiết</Text>
                            <Feather
                                name="chevron-right"
                                size={16}
                                color={Colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="basket-outline" size={100} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
            <Text style={styles.emptySubtitle}>
                {selectedTab === "all"
                    ? "Bạn chưa có đơn hàng nào"
                    : `Không có đơn hàng ${tabs
                          .find((t) => t.id === selectedTab)
                          ?.label.toLowerCase()}`}
            </Text>
            <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate("HomeScreen")}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[
                        Colors.primary,
                        Colors.secondary || Colors.primary,
                    ]}
                    style={styles.shopNowGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Feather name="shopping-bag" size={20} color="#fff" />
                    <Text style={styles.shopNowText}>Mua sắm ngay</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={["#1a73e8", "#4285f4"]}
                style={styles.header}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Feather name="filter" size={20} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Statistics Bar */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orders.length}</Text>
                    <Text style={styles.statLabel}>Tổng đơn</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {
                            orders.filter(
                                (o) =>
                                    o.order_status?.toLowerCase() === "pending"
                            ).length
                        }
                    </Text>
                    <Text style={styles.statLabel}>Chờ xử lý</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {
                            orders.filter(
                                (o) =>
                                    o.order_status?.toLowerCase() === "shipped"
                            ).length
                        }
                    </Text>
                    <Text style={styles.statLabel}>Đang giao</Text>
                </View>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabContainer}>
                <FlatList
                    data={tabs}
                    renderItem={renderTabItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabList}
                />
            </View>

            {/* Orders List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
                </View>
            ) : (
                <FlatList
                    data={getFilteredOrders()}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.order_id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                    ListEmptyComponent={EmptyComponent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 18,
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
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: "#666",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 5,
    },
    tabContainer: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    tabList: {
        paddingHorizontal: 16,
    },
    tabItem: {
        marginRight: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
    },
    activeTabItem: {
        backgroundColor: Colors.primary + "15",
    },
    tabContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 6,
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: "600",
    },
    tabBadge: {
        marginLeft: 6,
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activeTabBadge: {
        backgroundColor: Colors.primary,
    },
    tabBadgeText: {
        fontSize: 11,
        color: "#666",
        fontWeight: "600",
    },
    activeTabBadgeText: {
        color: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    listContainer: {
        padding: 16,
        flexGrow: 1,
    },
    orderCard: {
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientCard: {
        borderRadius: 16,
        padding: 16,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    orderIdContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    orderIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary + "15",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        color: "#999",
        flexDirection: "row",
        alignItems: "center",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusIcon: {
        marginRight: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    orderDetails: {
        borderTopWidth: 1,
        borderTopColor: "#f5f5f5",
        paddingTop: 16,
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 14,
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
        lineHeight: 18,
    },
    itemsPreview: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f5f5f5",
    },
    itemsCount: {
        fontSize: 14,
        color: "#666",
    },
    orderFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#f5f5f5",
    },
    priceContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.primary,
    },
    viewDetailButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary + "10",
        borderRadius: 20,
    },
    viewDetailText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: "600",
        marginRight: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyIconContainer: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#999",
        marginBottom: 32,
        textAlign: "center",
        paddingHorizontal: 40,
    },
    shopNowButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    shopNowGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    shopNowText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
});
