import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import ProductCard from "../../components/ProductCard";
import imageBanner from "../../../assets/image/banner.jpg";
import CategoryForm from "../../components/CategoryForm";
import Colors from "../../styles/Color";
import ApiService from "../../api/ApiService";

const products = [
  {
    id: 1,
    imageSource: require("../../../assets/image/shirt-1.jpg"),
    categoryName: "H&M",
    averageReview: 4.9,
    totalReview: 150,
    productName: "Oversized Fit Printed Mesh T-Shirt",
    oldPrice: "550.00",
    newPrice: "295.00",
  },
  {
    id: 2,
    imageSource: require("../../../assets/image/shirt-2.jpg"),
    categoryName: "H&M",
    averageReview: 4.8,
    totalReview: 200,
    productName: "Printed Sweatshirt",
    oldPrice: "414.00",
    newPrice: "314.00",
  },
  {
    id: 3,
    imageSource: require("../../../assets/image/kid-2.jpg"),
    categoryName: "H&M",
    averageReview: 4.8,
    totalReview: 200,
    productName: "Textured Jersey Dress",
    oldPrice: "399.00",
    newPrice: "300.00",
  },
];

export default function HomeContentScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ApiService.getCategories();
        setCategories(
          response.data.map((item) => ({
            id: item.category_id,
            name: item.category_name,
            imageSource: {
              uri: `http://192.168.1.5:8080${item.image_category}`,
            },
          }))
        );
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={imageBanner} style={styles.imageBanner} />
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
            key={product.id}
            imageSource={product.imageSource}
            categoryName={product.categoryName}
            averageReview={product.averageReview}
            totalReview={product.totalReview}
            productName={product.productName}
            oldPrice={product.oldPrice}
            newPrice={product.newPrice}
            onPress={() => navigation.navigate("ProductDetailScreen")}
            cardWidth={Dimensions.get("window").width * 0.5}
            imageWidth={"150%"}
            imageHeight={"150%"}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  imageBanner: {
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
