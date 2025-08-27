import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import ProductCard from "../../components/Product/ProductCard";
import { Feather } from "react-native-vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const CategoryProductsScreen = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const [storeName, setStoreName] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStoreName();
    loadCategoryProducts();
  }, [categoryId]);

  const loadStoreName = async () => {
    try {
      const response = await apiService.getStores();
      if (response && response.data.data && response.data.data[0]) {
        setStoreName(response.data.data[0].store_name);
      }
    } catch (error) {
      console.error("Failed to load store name:", error);
    }
  };

  const loadCategoryProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProductsByCategoryId(categoryId);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        setProducts([]);
        return;
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to load category products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
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
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> Danh mục {categoryName}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.resultCount}>
           Total {products.length} {products.length === 1 ? 'product' : 'products'}
          </Text>
          
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="shopping-bag" size={64} color={Colors.lightGrayColor} />
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyText}>
                  There are no products available in this category.
                </Text>
              </View>
            ) : (
              <View style={styles.productContainer}>
                {products.map((product, index) => (
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
                      })
                    }
                    cardWidth={Dimensions.get("window").width * 0.43}
                    imageWidth={"125%"}
                    imageHeight={"125%"}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
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
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.blackColor,
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 34, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 10,
    fontWeight: "500",
  },
  productList: {
    paddingBottom: 50,
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
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.blackColor,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default CategoryProductsScreen;