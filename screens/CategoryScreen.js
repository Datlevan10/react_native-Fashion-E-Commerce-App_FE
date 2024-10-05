import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import ProductCard from "../components/ProductCard";
import Feather from "react-native-vector-icons/Feather";
import FilterBox from "../components/FilterBox";
import CategoryForm from "../components/CategoryForm";
import category1Image from "../assets/image/bag.jpg";
import category2Image from "../assets/image/jean.jpg";
import category3Image from "../assets/image/footwear.jpg";
import category4Image from "../assets/image/clothes.jpg";

const categories = [
  {
    id: 1,
    name: "Bags",
    imageSource: category1Image,
  },
  {
    id: 2,
    name: "Jeans",
    imageSource: category2Image,
  },
  {
    id: 3,
    name: "Footwear",
    imageSource: category3Image,
  },
  {
    id: 4,
    name: "Clothes",
    imageSource: category4Image,
  },
];

const products = [
  {
    id: 1,
    imageSource: require("../assets/image/kid-2.jpg"),
    brandName: "H&M",
    rating: 4.5,
    numberRating: 150,
    productName: "Textured Jersey Dress",
    oldPrice: "488.00",
    newPrice: "399.00",
  },
  {
    id: 2,
    imageSource: require("../assets/image/kid-3.jpg"),
    brandName: "H&M",
    rating: 4.8,
    numberRating: 200,
    productName: "Button Front Dress",
    oldPrice: "550.00",
    newPrice: "499.00",
  },
  {
    id: 3,
    imageSource: require("../assets/image/kid-4.jpg"),
    brandName: "Adidas",
    rating: 4.8,
    numberRating: 200,
    productName: "Short Sleeved Cotton Dress",
    oldPrice: "550.00",
    newPrice: "499.00",
  },
  {
    id: 4,
    imageSource: require("../assets/image/kid-10.jpg"),
    brandName: "Adidas",
    rating: 4.8,
    numberRating: 200,
    productName: "Patterned Tulle Dress",
    oldPrice: "550.00",
    newPrice: "699.00",
  },
  {
    id: 5,
    imageSource: require("../assets/image/kid-6.jpg"),
    brandName: "Adidas",
    rating: 4.8,
    numberRating: 200,
    productName: "Tulle Dress",
    oldPrice: "899.00",
    newPrice: "799.00",
  },
  {
    id: 6,
    imageSource: require("../assets/image/kid-7.jpg"),
    brandName: "Adidas",
    rating: 4.8,
    numberRating: 200,
    productName: "Patterned Tulle Dress",
    oldPrice: "799.00",
    newPrice: "699.00",
  },
];

const CategoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#333" />
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
              placeholder="Search products with name, rating, size,..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox text="Filter" icon="filter-list" />
            <FilterBox text="Ratings" icon="keyboard-arrow-down" />
            <FilterBox text="Size" icon="keyboard-arrow-down" />
            <FilterBox text="Color" icon="keyboard-arrow-down" />
            <FilterBox text="Price" icon="keyboard-arrow-down" />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <CategoryForm
              key={categories.id}
              categories={categories}
              containerStyle={styles.customContainer}
            />
          </ScrollView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <View style={styles.productContainer}>
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  imageSource={product.imageSource}
                  brandName={product.brandName}
                  rating={product.rating}
                  numberRating={product.numberRating}
                  productName={product.productName}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  cardWidth={Dimensions.get("window").width * 0.43}
                  imageWidth={"125%"}
                  imageHeight={"125%"}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: "#f4f4f4",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 15,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  filterList: {
    height: 50,
    gap: 5,
    marginBottom: 30,
  },
  productList: {
    // paddingVertical: 10,
    marginBottom: 50,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default CategoryScreen;
