import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import FilterBox from "../../components/Other/FilterBox";
import CartForm from "../../components/Cart/CartForm";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../../styles/Color";
import { Linking } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import imageTest from "../../../assets/image/kid-2.jpg";
import imageTest1 from "../../../assets/image/kid-3.jpg";
import imageTest2 from "../../../assets/image/kid-4.jpg";
import imageTest3 from "../../../assets/image/kid-5.jpg";
import imageTest4 from "../../../assets/image/kid-6.jpg";
import imageTest5 from "../../../assets/image/kid-7.jpg";
import ApiService from "../../api/ApiService";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";

// Hardcoded products removed - now using real API data

const handleLearnMore = () => {
  Linking.openURL("https://yourwebsite.com/learn-more");
};

export default function CartScreen({ navigation }) {
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSelectItem = (itemCount, itemPrice) => {
    setSelectedItemsCount(itemCount);
    setTotalAmount(itemCount * itemPrice);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

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
      
      // Fetch cart items from API
      const response = await ApiService.getCustomerNotOrderedCartDetails(storedCustomerId);
      
      if (response.status === 200 && response.data?.data) {
        const items = response.data.data.map(item => ({
          id: item.cart_detail_id,
          cartDetailId: item.cart_detail_id,
          productImage: item.product?.images?.[0]?.image_url || imageTest,
          categoryName: item.product?.category?.category_name || "Category",
          productName: item.product?.product_name || "Product",
          initialColor: item.color,
          initialSize: item.size,
          price: parseFloat(item.product?.new_price || 0),
          initialQuantity: item.quantity,
          productId: item.product_id
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Failed to load cart items");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add items to cart before checkout");
      return;
    }
    
    // Navigate to OrderScreen with cart items
    navigation.navigate('OrderScreen', { 
      cartItems: cartItems.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        image_url: item.productImage,
        new_price: item.price,
        quantity: item.initialQuantity,
        color: item.initialColor,
        size: item.initialSize,
        cart_detail_id: item.cartDetailId
      })),
      cartId: null
    });
  };

  const handleRemoveItem = async (cartDetailId) => {
    try {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item from cart?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              const response = await ApiService.removeFromCart(cartDetailId);
              if (response.status === 200) {
                Alert.alert("Success", "Item removed from cart");
                fetchCartData(); // Refresh cart data
              } else {
                Alert.alert("Error", "Failed to remove item");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (cartDetailId, quantity) => {
    try {
      const response = await ApiService.updateCartItem(cartDetailId, quantity);
      if (response.status === 200) {
        fetchCartData(); // Refresh cart data
      } else {
        Alert.alert("Error", "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity");
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart Page</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.body}>
          <View style={styles.divider} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={false}
            nestedScrollEnabled={false}
            directionalLockEnabled={true}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox text="Sort" icon="keyboard-arrow-down" />
            <FilterBox text="Category" icon="keyboard-arrow-down" />
            <FilterBox text="Brand" icon="keyboard-arrow-down" />
            <FilterBox text="Men" icon="keyboard-arrow-down" />
            <FilterBox text="Women" icon="keyboard-arrow-down" />
          </ScrollView>
          <View style={styles.divider} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.blackColor} />
                <Text style={styles.loadingText}>Loading cart items...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchCartData} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : cartItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Home')} 
                  style={styles.shopButton}
                >
                  <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              cartItems.map((product, index) => (
                <View key={product.id}>
                  <CartForm
                    productImage={product.productImage}
                    categoryName={product.categoryName}
                    productName={product.productName}
                    initialColor={product.initialColor}
                    initialSize={product.initialSize}
                    price={product.price}
                    initialQuantity={product.initialQuantity}
                    cartDetailId={product.cartDetailId}
                    onRemove={() => handleRemoveItem(product.cartDetailId)}
                    onUpdateQuantity={(quantity) => handleUpdateQuantity(product.cartDetailId, quantity)}
                  />
                  {index !== cartItems.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            )}
          </ScrollView>
          <View style={styles.divider} />
          <View style={styles.freeShippingContainer}>
            <Text style={styles.freeShippingText}>
              You're <Text style={styles.amountText}>$51</Text> from{" "}
              <Text style={styles.flatRateText}>flat rate shipping</Text>. Save
              on shipping by adding an eligible item to cart.
            </Text>
            <TouchableOpacity
              onPress={handleLearnMore}
              style={styles.learnMoreButton}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryContainer}>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>
                {selectedItemsCount} Item{selectedItemsCount !== 1 ? "" : ""}
              </Text>
            </View>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountText}>
                ${totalAmount.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={handleCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
                {/* <MaterialIcons name="shopping-cart-checkout" size={22} color={Colors.whiteColor} /> */}
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.blackColor,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
  },
  filterList: {
    flexDirection: "row",
    height: 55,
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  freeShippingContainer: {
    backgroundColor: Colors.lightGray,
    marginVertical: 10,
    alignItems: "flex-start",
  },
  freeShippingText: {
    fontSize: 17,
    color: Colors.blackColor,
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  flatRateText: {
    color: "#036f48",
  },
  learnMoreButton: {
    marginTop: 5,
    paddingVertical: 5,
  },
  learnMoreText: {
    color: "#036f48",
    fontWeight: "bold",
    fontSize: 18,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  itemCountContainer: {
    flex: 1,
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCountText: {
    fontSize: 20,
    color: Colors.darkGray,
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginRight: 10,
  },
  checkoutButton: {
    backgroundColor: "#036f48",
    flexDirection: "row",
    gap: 10,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  checkoutText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.blackColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  errorText: {
    fontSize: 16,
    color: Colors.blackColor,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.blackColor,
    textAlign: "center",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  shopButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
