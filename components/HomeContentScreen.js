import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import CategoriesScreen from "./CategoriesScreen";
import ProductForm from "./ProductForm";
import ProductInfo from "./ProductInfo";

import imageBanner from "../assets/banner.jpg";

export default function HomeContentScreen() {
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
        contentContainerStyle={styles.productList}
      >
        <CategoriesScreen />
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
        <View style={styles.productContainer}>
          <ProductForm imageSource={require("../assets/shirt-1.jpg")} />
          <ProductInfo
            brandName="H&M"
            rating="4.9"
            numberRating="136"
            productName="Oversized Fit Printed Mesh T-Shirt"
            oldPrice="550.00"
            newPrice="295.00"
          />
        </View>
        <View style={styles.productContainer}>
          <ProductForm imageSource={require("../assets/shirt-2.jpg")} />
          <ProductInfo
            brandName="H&M"
            rating="4.8"
            numberRating="178"
            productName="Printed Sweatshirt"
            oldPrice="414.00"
            newPrice="314.00"
          />
        </View>
        <View style={styles.productContainer}>
          <ProductForm imageSource={require("../assets/kid-2.jpg")} />
          <ProductInfo
            brandName="H&M"
            rating="5.0"
            numberRating="599"
            productName="Textured Jersey Dress"
            oldPrice="399.00"
            newPrice="200.00"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // justifyContent: "center",
    // paddingHorizontal: 18
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
    marginTop: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
  },
  moreText: {
    fontSize: 14,
    color: "#7d7979",
  },
  productList: {
    paddingHorizontal: 9,
    // width: Dimensions.get("window").width * 0.5,
  },
});
