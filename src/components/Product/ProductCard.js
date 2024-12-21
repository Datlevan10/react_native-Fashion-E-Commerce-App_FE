import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather, FontAwesome } from "react-native-vector-icons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../styles/Color";

const ProductCard = ({
  imageSource,
  storeName,
  // categoryName,
  productName,
  description,
  color,
  size,
  oldPrice,
  newPrice,
  averageReview,
  totalReview,
  onPress,
  onRemove,
  cardWidth = Dimensions.get("window").width * 0.5,
  imageWidth = "150%",
  imageHeight = "150%",
}) => {
  const [currentImageSource, setCurrentImageSource] = useState(imageSource);
  const errorImage = require("../../../assets/image/default_image.jpg");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cardContainer, { width: cardWidth }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={currentImageSource}
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
          resizeMode="contain"
          onError={() => setCurrentImageSource(errorImage)}
        />
        <View style={styles.heartIconContainer}>
          {onRemove ? (
            <TouchableOpacity onPress={onRemove}>
              <FontAwesome name="heart" size={20} color={Colors.redColor} />
            </TouchableOpacity>
          ) : (
            <FontAwesome name="heart-o" size={20} color={Colors.whiteColor} />
          )}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          {/* <Text style={styles.brandText}>{categoryName}</Text> */}
          <Text style={styles.brandText}>{storeName}</Text>
          <View style={styles.averageReviewContainer}>
            <AntDesign name="star" size={15} color={Colors.yellowColor} />
            <Text style={styles.averageReviewText}>{averageReview}</Text>
            <Text style={styles.totalReview}>{`(${totalReview})`}</Text>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.whiteBgColor,
    borderRadius: 8,
    overflow: "visible",
    marginVertical: 10,
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: Colors.grayBgColor,
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
    backgroundColor: Colors.darkGray,
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
    backgroundColor: Colors.whiteBgColor,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  brandText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  averageReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  averageReviewText: {
    marginLeft: 3,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
  totalReview: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  productName: {
    width: "100%",
    fontSize: 20,
    marginVertical: 5,
    fontWeight: "600",
    color: Colors.blackColor,
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
    color: Colors.darkGray,
  },
  newPrice: {
    fontSize: 22,
    fontWeight: "500",
    color: Colors.redColor,
  },
});

export default ProductCard;
