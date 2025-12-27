import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Feather, MaterialIcons } from "react-native-vector-icons";
import IconWithBadge from "../../components/Navbar/IconWithBadge";
import apiService from "../../api/ApiService";
import ProductCard from "../../components/Product/ProductCard";
import Colors from "../../styles/Color";
import API_BASE_URL from "../../configs/config";
import ShowAlertWithTitleContentAndTwoActions from "../../components/Alert/ShowAlertWithTitleContentAndTwoActions ";

export default function WishlistScreen({ navigation }) {
  const [storeName, setStoreName] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const loadStoreName = async () => {
    try {
      const response = await apiService.getStores();
      if (response && response.data.data && response.data.data[1]) {
        setStoreName(response.data.data[1].store_name);
      }
    } catch (error) {
      console.error("Failed to load store name:", error);
    }
  };

  const fetchCartItemCount = async () => {
    try {
      const storedCustomerId = await SecureStore.getItemAsync("customer_id");
      if (!storedCustomerId) {
        setCartItemCount(0);
        return;
      }

      const response = await apiService.getProductInCartDetailByCustomerId(
        storedCustomerId
      );

      if (response.status === 200 && response.data?.data) {
        const cartItems = response.data.data;
        setCartItemCount(Array.isArray(cartItems) ? cartItems.length : 0);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.log("Error fetching cart count:", error);
      setCartItemCount(0);
    }
  };

  const loadWishlist = async () => {
    try {
      const customer_id = await SecureStore.getItemAsync("customer_id");
      if (!customer_id) {
        Alert.alert("Error", "No customer ID found.");
        return;
      }

      const response = await apiService.getFavoriteProductByCustomerId(
        customer_id
      );
      if (response.status === 200) {
        const productsArray = response.data.data;

        const processedWishlist = productsArray.map((item) => ({
          productFavoriteId: item.product_favorite_id,
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map(
            (img) => `${API_BASE_URL}${img.url}`
          ),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => 
            typeof color === 'string' ? color : `${color.color_code}`
          ),
          sizeArr: item.size.map((size) => 
            typeof size === 'string' ? size : `${size.size}`
          ),
          variant: item.variant || [],
          storeName: item.store_name || "Unknown Store",
          quantityInStock: item.quantity_in_stock || 0,
        }));

        setWishlist(processedWishlist);
      } else {
        Alert.alert("Error", "Failed to fetch wishlist.");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadWishlist();
    fetchCartItemCount();
  };

  const handleRemoveFromWishlist = async (productFavoriteId) => {
    try {
      const response = await apiService.removeProductFromFavorite(
        productFavoriteId
      );

      if (response.status === 200) {
        setWishlist((prev) =>
          prev.filter((item) => item.product_favorite_id !== productFavoriteId)
        );
        Alert.alert("Success", "Product removed from wishlist.");
        loadWishlist();
      } else {
        Alert.alert("Error", "Failed to remove product from wishlist.");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      Alert.alert("Error", "An error occurred while removing the product.");
    }
  };

  useEffect(() => {
    loadStoreName();
    loadWishlist();
    fetchCartItemCount();
  }, []);

  // Listen for focus event to refresh cart count when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartItemCount();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm yêu thích"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <View style={styles.micContainer}>
              <IconWithBadge
                name="shopping-bag"
                badgeCount={cartItemCount}
                size={24}
                color="#333"
                // style={styles.micIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.productList,
            wishlist.length === 0 && { flex: 1 },
          ]}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {wishlist.length > 0 ? (
            <View style={styles.productContainer}>
              {wishlist.map((product, index) => (
                <ProductCard
                  key={product.productId}
                  imageSource={product.productImage}
                  storeName={storeName}
                  averageReview={product.averageReview}
                  totalReview={product.totalReview}
                  productName={product.productName}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  color={product.colorArr}
                  size={product.sizeArr}
                  onPress={() =>
                    navigation.navigate("ProductDetailScreen", {
                      product,
                      images: product.imageArr,
                      colors: product.colorArr,
                      sizes: product.sizeArr,
                      quantityInStock: product.quantityInStock,
                    })
                  }
                  onRemove={() =>
                    ShowAlertWithTitleContentAndTwoActions(
                      "Notification",
                      "Are you sure you want to remove this product from wishlist?",
                      () => handleRemoveFromWishlist(product.productFavoriteId)
                    )
                  }
                  cardWidth={Dimensions.get("window").width * 0.43}
                  imageWidth={"125%"}
                  imageHeight={"125%"}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Your wish list is empty, add product to wishlist now.
              </Text>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: Colors.grayBgColor,
    backgroundColor: Colors.whiteColor,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.blackColor,
  },
  micContainer: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  productList: {
    paddingLeft: 18,
    paddingRight: 18,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.darkGray,
  },
});
