import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import ProductCard from "../../components/ProductCard";
import CategoryForm from "../../components/CategoryForm";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";

export default function HomeContentScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [imageEventSource, setImageEventSource] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadCategories(),
        loadEventImage(),
        loadProducts(),
        loadStoreName(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(
        response.data.map((item) => ({
          id: item.category_id,
          name: item.category_name,
          imageSource: {
            uri: `http://192.168.1.4:8080${item.image_category}`,
          },
        }))
      );
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadEventImage = async () => {
    try {
      const response = await apiService.getEventImageActive();
      if (
        response &&
        response.data &&
        response.data[0] &&
        response.data[0].event_image.length > 0
      ) {
        setImageEventSource({
          uri: `http://192.168.1.4:8080${response.data[0].event_image[0]}`,
        });
      }
    } catch (error) {
      console.error("Failed to load event image:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await apiService.getFeatureProducts("category5");
      // console.log("API Response:", response);
      const productsArray = response.data;

      if (!Array.isArray(productsArray)) {
        throw new Error("API response.data is not an array");
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          imageSource: {
            uri: `http://192.168.1.4:8080${item.image[0].url}`,
          },
          imageArr: item.image.map(
            (img) => `http://192.168.1.4:8080${img.url}`
          ),
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
      console.error("Failed to load products:", error);
    }
  };

  const loadStoreName = async () => {
    try {
      const response = await apiService.getStores();
      if (response && response.data && response.data[0]) {
        setStoreName(response.data[0].store_name);
      }
    } catch (error) {
      console.error("Failed to load store name:", error);
    }
  };

  useEffect(() => {
    // load data
    loadCategories();
    loadEventImage();
    loadProducts();
    loadStoreName();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    >
      <View style={styles.container}>
        {imageEventSource ? (
          <Image source={imageEventSource} style={styles.imageEvent} />
        ) : (
          <Text style={styles.loadingText}>Loading image Event...</Text>
        )}
        <View style={styles.itemBar}>
          <Text style={styles.titleText}>Shop By Category</Text>
          <Text style={styles.moreText}>See All</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          <CategoryForm
            categories={categories}
            containerStyle={styles.customContainer}
          />
        </ScrollView>
        <View style={styles.itemBar}>
          <Text style={styles.titleText}>Curated For You</Text>
          <Text style={styles.moreText}>See All</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        >
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              imageSource={product.imageSource}
              storeName={storeName}
              // categoryName={product.categoryName}
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
              cardWidth={Dimensions.get("window").width * 0.5}
              imageWidth={"150%"}
              imageHeight={"150%"}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  imageEvent: {
    height: 170,
    width: 400,
  },
  itemBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 18,
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.blackColor,
  },
  moreText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  categoryList: {
    paddingHorizontal: 18,
  },
  productList: {
    paddingHorizontal: 18,
    gap: 18,
  },
});
