import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ItemDetail = ({
  productImage,
  categoryName,
  productName,
  price,
  color,
  size,
  quantity,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={productImage} style={styles.productImage} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.categoryText}>{categoryName}</Text>
            <Text style={styles.productNameText}>{productName}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.extraDetails}>
          <View style={styles.extraDetailRow}>
            <Text style={styles.detailTitle}>Color:</Text>
            <Text style={styles.detailValue}>{color}</Text>
          </View>
          <View style={styles.extraDetailRow}>
            <Text style={styles.detailTitle}>Size:</Text>
            <Text style={styles.detailValue}>{size}</Text>
          </View>
          <View style={styles.extraDetailRow}>
            <Text style={styles.detailTitle}>Quantity:</Text>
            <Text style={styles.detailValue}>{quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    gap: 15,
    marginBottom: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  categoryText: {
    fontSize: 17,
    color: "#444",
  },
  productNameText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#036f48",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  extraDetails: {
    marginTop: 0,
  },
  extraDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 17,
    color: "#888",
  },
  detailValue: {
    fontSize: 17,
    color: "#333",
    fontWeight: "bold",
  },
});

export default ItemDetail;
