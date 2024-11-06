import React from "react";
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
import category1Image from "../../../assets/image/women.jpg";
import category2Image from "../../../assets/image/men.jpg";
import category3Image from "../../../assets/image/teen.jpg";
import category4Image from "../../../assets/image/kid.jpg";
import Colors from "../../styles/Color";

const categories = [
  {
    id: 1,
    name: "Women",
    imageSource: category1Image,
  },
  {
    id: 2,
    name: "Men",
    imageSource: category2Image,
  },
  {
    id: 3,
    name: "Teens",
    imageSource: category3Image,
  },
  {
    id: 4,
    name: "Kids",
    imageSource: category4Image,
  },
];

const products = [
  {
    id: 1,
    imageSource: require("../../../assets/image/shirt-1.jpg"),
    brandName: "H&M",
    rating: 4.9,
    numberRating: 150,
    productName: "Oversized Fit Printed Mesh T-Shirt",
    oldPrice: "550.00",
    newPrice: "295.00",
  },
  {
    id: 2,
    imageSource: require("../../../assets/image/shirt-2.jpg"),
    brandName: "H&M",
    rating: 4.8,
    numberRating: 200,
    productName: "Printed Sweatshirt",
    oldPrice: "414.00",
    newPrice: "314.00",
  },
  {
    id: 3,
    imageSource: require("../../../assets/image/kid-2.jpg"),
    brandName: "H&M",
    rating: 4.8,
    numberRating: 200,
    productName: "Textured Jersey Dress",
    oldPrice: "399.00",
    newPrice: "300.00",
  },
];

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
            brandName={product.brandName}
            rating={product.rating}
            numberRating={product.numberRating}
            productName={product.productName}
            oldPrice={product.oldPrice}
            newPrice={product.newPrice}
            cardWidth={Dimensions.get("window").width * 0.50}
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
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryList: {
    paddingHorizontal: 9
  },
  productList: {
    paddingHorizontal: 18,
    gap: 18,
  },
});
