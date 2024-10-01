import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

const ProductCard = ({
  imageSource,
  brandName,
  rating,
  numberRating,
  productName,
  oldPrice,
  newPrice,
  cardWidth = Dimensions.get("window").width * 0.5,
  imageWidth = "150%",
  imageHeight = "150%",
}) => {
  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
          resizeMode="contain"
        />
        <View style={styles.heartIconContainer}>
          <Feather name="heart" size={20} color="white" />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.brandText}>{brandName}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color="#ffc32b" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.numberRating}>{`(${numberRating})`}</Text>
          </View>
        </View>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {productName}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.newPrice}>${newPrice}</Text>
          <Text style={styles.oldPrice}>${oldPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "visible",
    marginVertical: 10,
    // width: '100%',
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: "#f4f4f4",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  heartIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#b4b3b3",
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    width: "100%",

    backgroundColor: "#ffffff",
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  brandText: {
    fontSize: 16,
    color: "gray",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    width: "100%",
    fontSize: 20,
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
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 10,
    color: "gray",
  },
  newPrice: {
    fontSize: 22,
    fontWeight: "500",
    color: "#ed1b41",
  },
});

export default ProductCard;
