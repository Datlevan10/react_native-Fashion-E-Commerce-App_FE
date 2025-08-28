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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get customer ID from secure store
      const storedCustomerId = await SecureStore.getItemAsync("customer_id");
      if (!storedCustomerId) {
        setError("Please login to view your cart");
        setLoading(false);
        return;
      }
      
      setCustomerId(storedCustomerId);
      
      // Fetch cart items using the correct API
      const response = await ApiService.getProductInCartDetailByCustomerId(storedCustomerId);
      
      if (response.status === 200 && response.data?.data) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      if (error.response?.status === 404) {
        setCartItems([]);
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
      return sum + parseFloat(item.total_price || 0);
    }, 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = async (cartDetailId, newQuantity) => {
    try {
      const response = await ApiService.updateCartItem(cartDetailId, newQuantity);
      if (response.status === 200 && response.data) {
        // Update local state with backend response data
        const updatedItem = response.data.data;
        const cartTotal = parseFloat(response.data.cart_total);
        
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.cart_detail_id === cartDetailId
              ? {
                  ...item,
                  quantity: updatedItem.quantity,
                  total_price: updatedItem.total_price.toString(),
                  unit_price: updatedItem.unit_price
                }
              : item
          )
        );
        
        // Success feedback
        console.log(`Cart item updated: Quantity ${updatedItem.quantity}, Total: ${cartTotal}`);
      } else {
        Alert.alert("Error", "Failed to update quantity");
        fetchCartData(); // Refresh to get correct data
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
      fetchCartData(); // Refresh to get correct data
    }
  };

  const handleRemoveItem = async (cartDetailId) => {
    try {
      const response = await ApiService.removeFromCart(cartDetailId);
      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.filter(item => item.cart_detail_id !== cartDetailId)
        );
        Alert.alert("Success", "Item removed from cart");
      } else {
        Alert.alert("Error", "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item from cart");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCartData();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add items to cart before checkout");
      return;
    }
    
    // Navigate to OrderScreen with cart items
    const orderItems = cartItems.map(item => ({
      cart_detail_id: item.cart_detail_id,
      product_id: item.product_id,
      product_name: item.product_name,
      image_url: item.image,
      unit_price: parseFloat(item.unit_price),
      quantity: item.quantity,
      total_price: parseFloat(item.total_price),
      color: item.color,
      size: item.size
    }));
    
    navigation.navigate('OrderScreen', { 
      cartItems: orderItems,
      totalAmount: totalPrice,
      fromCart: true
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color={Colors.lightGray} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet
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
      <TouchableOpacity onPress={fetchCartData} style={styles.retryButton}>
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
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={loading}>
            <Feather 
              name="refresh-cw" 
              size={24} 
              color={loading ? Colors.lightGray : Colors.blackColor} 
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? renderLoading() : error ? renderError() : cartItems.length === 0 ? renderEmptyCart() : (
            <>
              {/* Cart Items */}
              <ScrollView 
                style={styles.itemsList}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              >
                <View style={styles.itemsHeader}>
                  <Text style={styles.itemsCount}>
                    {cartItems.length} sản phẩm{cartItems.length !== 1 ? 's' : ''} trong giỏ hàng
                  </Text>
                </View>
                
                {cartItems.map((item) => (
                  <ModernCartItem
                    key={item.cart_detail_id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onSizeChange={(cartDetailId, newSize) => {
                      // Size change functionality - can be implemented later
                      console.log('Size change requested:', cartDetailId, newSize);
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
                    <Text style={styles.priceLabel}>Tổng phụ:</Text>
                    <Text style={styles.priceValue}>{formatPrice(totalPrice)}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Vận chuyển:</Text>
                    <Text style={styles.freeShipping}>MIỄN PHÍ</Text>
                  </View>
                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
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
  itemsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
  bottomSpacing: {
    height: 20,
  },
  bottomSection: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
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