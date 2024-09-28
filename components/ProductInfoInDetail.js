import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

const ProductInfoInDetail = ({
  brandName,
  rating,
  numberRating,
  productName,
  oldPrice,
  newPrice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.brandText}>{brandName}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="#ffc32b" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.numberRating}>{`(${numberRating})`}</Text>
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
  brandName: {
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
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  numberRating: {
    color: "gray",
  },
  productName: {
    // width: Dimensions.get("window").width * 0.5,
    fontSize: 24,
    marginVertical: 5,
    fontWeight: "600",
    color: "black",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  oldPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    marginRight: 10,
    color: "gray",
  },
  newPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ed1b41",
  },
});

export default ProductInfoInDetail;
