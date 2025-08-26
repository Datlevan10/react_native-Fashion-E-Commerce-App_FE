import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

const ProductInfoInDetail = ({
  categoryName,
  averageReview,
  totalReview,
  productName,
  oldPrice,
  newPrice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.brandText}>{categoryName}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={15} color="#ffc32b" />
          <Text style={styles.averageReviewText}>{averageReview}</Text>
          <Text style={styles.totalReviewText}>{`(${totalReview})`}</Text>
        </View>
      </View>
      <Text style={styles.productName}>{productName}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.newPrice}>${newPrice}</Text>
        <Text style={styles.oldPrice}>${oldPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  categoryName: {
    color: "gray",
  },
  brandText: {
    fontSize: 18,
    color: "gray",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 5
  },
  averageReviewText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  totalReviewText: {
    color: "gray",
    fontSize: 18,
  },
  productName: {
    // width: Dimensions.get("window").width * 0.5,
    fontSize: 24,
    marginVertical: 5,
    // textTransform: "uppercase",
    fontWeight: "600",
    color: "black",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  oldPrice: {
    fontSize: 18,
    textDecorationLine: "line-through",
    marginRight: 10,
    color: "gray",
  },
  newPrice: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ed1b41",
  },
});

export default ProductInfoInDetail;
