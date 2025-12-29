import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import ApiService from "../../api/ApiService";
import ModernCartItem from "../../components/Cart/ModernCartItem";
import Colors from "../../styles/Color";

const { width, height } = Dimensions.get("window");

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems, selectedItems]);

    const fetchCartData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get customer ID from secure store
            const storedCustomerId = await SecureStore.getItemAsync(
                "customer_id"
            );
            if (!storedCustomerId) {
                setError("Please login to view your cart");
                setLoading(false);
                return;
            }

            setCustomerId(storedCustomerId);

            // First get the customer's cart to get cart_id
            let customerCartId = null;
            try {
                const cartResponse = await ApiService.getCustomerCart(
                    storedCustomerId
                );
                if (cartResponse.status === 200 && cartResponse.data?.data) {
                    customerCartId = cartResponse.data.data.cart_id;
                    setCartId(customerCartId);
                }
            } catch (cartError) {
                console.log("No active cart found for customer");
            }

            // Fetch cart items using the correct API
            const response =
                await ApiService.getProductInCartDetailByCustomerId(
                    storedCustomerId
                );

            if (response.status === 200 && response.data?.data) {
                const itemsWithCartId = response.data.data.map((item) => ({
                    ...item,
                    cart_id: customerCartId || item.cart_id, // Use fetched cart_id or item's cart_id if available
                }));
                setCartItems(itemsWithCartId);
                // Initialize all items as selected by default
                setSelectedItems(
                    itemsWithCartId.map((item) => item.cart_detail_id)
                );
                // If we don't have cartId yet, try to get it from first item
                if (
                    !customerCartId &&
                    itemsWithCartId.length > 0 &&
                    itemsWithCartId[0].cart_id
                ) {
                    setCartId(itemsWithCartId[0].cart_id);
                }
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            if (error.response?.status === 404) {
                // Handle 404 gracefully - show empty cart instead of error
                setCartItems([]);
                setCartId(null);
                setError(null);
            } else {
                setError("Failed to load cart items");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((sum, item) => {
            // Only calculate price for selected items
            if (selectedItems.includes(item.cart_detail_id)) {
                return sum + parseFloat(item.total_price || 0);
            }
            return sum;
        }, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = async (cartDetailId, newQuantity) => {
        try {
            const response = await ApiService.updateCartItem(
                cartDetailId,
                newQuantity
            );
            if (response.status === 200 && response.data) {
                if (response.data.stock_exceeded) {
                    Alert.alert(
                        "Vượt quá số lượng tồn kho",
                        `Sản phẩm chỉ còn ${response.data.available_quantity} trong kho. Số lượng đã được cập nhật về mức tối đa có thể.`,
                        [
                            { 
                                text: "Đồng ý", 
                                style: "default"
                            }
                        ]
                    );
                }

                // Update local state with backend response data
                const updatedItem = response.data.data;
                const cartTotal = parseFloat(response.data.cart_total);

                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.cart_detail_id === cartDetailId
                            ? {
                                  ...item,
                                  quantity: updatedItem.quantity,
                                  total_price:
                                      updatedItem.total_price.toString(),
                                  unit_price: updatedItem.unit_price,
                              }
                            : item
                    )
                );

                // Success feedback (only log if not stock exceeded)
                if (!response.data.stock_exceeded) {
                    console.log(
                        `Cart item updated: Quantity ${updatedItem.quantity}, Total: ${cartTotal}`
                    );
                }
            } else {
                Alert.alert("Lỗi", "Không thể cập nhật số lượng");
                fetchCartData(); // Refresh to get correct data
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            Alert.alert(
                "Lỗi",
                "Không thể cập nhật số lượng. Vui lòng thử lại."
            );
            fetchCartData(); // Refresh to get correct data
        }
    };

    const handleRemoveItem = async (cartDetailId) => {
        try {
            const response = await ApiService.removeFromCart(cartDetailId);
            if (response.status === 200) {
                setCartItems((prevItems) =>
                    prevItems.filter(
                        (item) => item.cart_detail_id !== cartDetailId
                    )
                );
                // Also remove from selected items
                setSelectedItems((prevSelected) =>
                    prevSelected.filter((id) => id !== cartDetailId)
                );
                Alert.alert("Thành công", "Sản phẩm đã được xóa khỏi giỏ hàng");
            } else {
                Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
        }
    };

    const handleToggleItem = (cartDetailId) => {
        setSelectedItems((prev) => {
            if (prev.includes(cartDetailId)) {
                return prev.filter((id) => id !== cartDetailId);
            } else {
                return [...prev, cartDetailId];
            }
        });
    };

    const handleToggleAll = () => {
        if (selectedItems.length === cartItems.length) {
            // If all selected, deselect all
            setSelectedItems([]);
        } else {
            // Select all
            setSelectedItems(cartItems.map((item) => item.cart_detail_id));
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCartData();
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            Alert.alert(
                "Chưa chọn sản phẩm",
                "Vui lòng chọn ít nhất một sản phẩm để thanh toán"
            );
            return;
        }

        if (!cartId) {
            Alert.alert(
                "Error",
                "Unable to find cart information. Please try again."
            );
            return;
        }

        // Navigate to OrderScreen with only selected cart items
        const selectedCartItems = cartItems.filter((item) =>
            selectedItems.includes(item.cart_detail_id)
        );

        const orderItems = selectedCartItems.map((item) => ({
            cart_detail_id: item.cart_detail_id,
            product_id: item.product_id,
            product_name: item.product_name,
            image_url: item.image,
            new_price: parseFloat(item.unit_price), // Fix: OrderScreen expects new_price
            unit_price: parseFloat(item.unit_price),
            quantity: item.quantity,
            total_price: parseFloat(item.total_price),
            color: item.color,
            size: item.size,
        }));

        navigation.navigate("OrderScreen", {
            cartId: cartId, // Fix: Pass cart_id
            cartItems: orderItems,
            totalAmount: totalPrice,
            fromCart: true,
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const renderEmptyCart = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons
                name="shopping-cart"
                size={80}
                color={Colors.lightGray}
            />
            <Text style={styles.emptyTitle}>Giỏ hàng của bạn trống</Text>
            <Text style={styles.emptySubtitle}>
                Có vẻ như bạn chưa thêm bất cứ thứ gì vào giỏ hàng.
            </Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.shopButtonText}>Bắt đầu mua sắm</Text>
            </TouchableOpacity>
        </View>
    );

    const renderError = () => (
        <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={60} color="#ff4757" />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
                onPress={fetchCartData}
                style={styles.retryButton}
            >
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.blackColor} />
            <Text style={styles.loadingText}>Loading your cart...</Text>
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
                        <Feather
                            name="arrow-left"
                            size={24}
                            color={Colors.blackColor}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Giỏ hàng</Text>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        disabled={loading}
                    >
                        <Feather
                            name="refresh-cw"
                            size={24}
                            color={
                                loading ? Colors.lightGray : Colors.blackColor
                            }
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {loading ? (
                        renderLoading()
                    ) : error ? (
                        renderError()
                    ) : cartItems.length === 0 ? (
                        renderEmptyCart()
                    ) : (
                        <>
                            {/* Cart Items */}
                            <ScrollView
                                style={styles.itemsList}
                                showsVerticalScrollIndicator={false}
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            >
                                <View style={styles.itemsHeader}>
                                    <View style={styles.headerRow}>
                                        <TouchableOpacity
                                            style={styles.selectAllContainer}
                                            onPress={handleToggleAll}
                                        >
                                            <View
                                                style={[
                                                    styles.checkbox,
                                                    selectedItems.length ===
                                                        cartItems.length &&
                                                        cartItems.length > 0 &&
                                                        styles.checkboxSelected,
                                                ]}
                                            >
                                                {selectedItems.length ===
                                                    cartItems.length &&
                                                    cartItems.length > 0 && (
                                                        <MaterialIcons
                                                            name="check"
                                                            size={16}
                                                            color={
                                                                Colors.whiteColor
                                                            }
                                                        />
                                                    )}
                                            </View>
                                            <Text style={styles.selectAllText}>
                                                Chọn tất cả
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={styles.itemsCount}>
                                            {selectedItems.length}/
                                            {cartItems.length} sản phẩm
                                        </Text>
                                    </View>
                                </View>

                                {cartItems.map((item) => (
                                    <ModernCartItem
                                        key={item.cart_detail_id}
                                        item={item}
                                        isSelected={selectedItems.includes(
                                            item.cart_detail_id
                                        )}
                                        onToggleSelect={() =>
                                            handleToggleItem(
                                                item.cart_detail_id
                                            )
                                        }
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemoveItem}
                                        onSizeChange={(
                                            cartDetailId,
                                            newSize
                                        ) => {
                                            // Size change functionality - can be implemented later
                                            console.log(
                                                "Size change requested:",
                                                cartDetailId,
                                                newSize
                                            );
                                        }}
                                    />
                                ))}

                                <View style={styles.bottomSpacing} />
                            </ScrollView>

                            {/* Fixed Bottom Section */}
                            <View style={styles.bottomSection}>
                                {/* Price Summary */}
                                <View style={styles.priceSection}>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>
                                            Tổng phụ:
                                        </Text>
                                        <Text style={styles.priceValue}>
                                            {formatPrice(totalPrice)}
                                        </Text>
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>
                                            Vận chuyển:
                                        </Text>
                                        <Text style={styles.freeShipping}>
                                            MIỄN PHÍ
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.priceRow,
                                            styles.totalRow,
                                        ]}
                                    >
                                        <Text style={styles.totalLabel}>
                                            Tổng cộng:
                                        </Text>
                                        <Text style={styles.totalValue}>
                                            {formatPrice(totalPrice)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Checkout Button */}
                                <TouchableOpacity
                                    style={styles.checkoutButton}
                                    onPress={handleCheckout}
                                >
                                    <Text style={styles.checkoutText}>
                                        Tiến hành thanh toán
                                    </Text>
                                    <MaterialIcons
                                        name="arrow-forward"
                                        size={20}
                                        color={Colors.whiteColor}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

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
    itemsList: {
        flex: 1,
    },
    itemsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    selectAllContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.darkGray,
        backgroundColor: Colors.whiteColor,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxSelected: {
        backgroundColor: Colors.blackColor,
        borderColor: Colors.blackColor,
    },
    selectAllText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.blackColor,
    },
    itemsCount: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.darkGray,
    },
    bottomSpacing: {
        height: 20,
    },
    bottomSection: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 0,
        borderTopWidth: 1,
        borderTopColor: "#e9ecef",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    priceSection: {
        marginBottom: 20,
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
    freeShipping: {
        fontSize: 16,
        fontWeight: "600",
        color: "#10ac84",
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "#e9ecef",
        marginTop: 8,
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
    checkoutButton: {
        backgroundColor: Colors.blackColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    checkoutText: {
        color: Colors.whiteColor,
        fontSize: 18,
        fontWeight: "700",
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
