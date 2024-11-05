import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

const ItemInCart = ({ image, productName, color, size, price, quantity }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.productImage} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textRow}>
          <Text style={styles.productName}>{productName}</Text>
          <View style={styles.colorSizeRow}>
            <Text style={styles.productColor}>{color}</Text>
            <Text style={styles.productSize}>{size}</Text>
          </View>
        </View>
        <View style={styles.priceQuantityRow}>
          <Text style={styles.productPrice}>$ {price}</Text>
          <Text style={styles.productQuantity}>X{quantity}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageContainer: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  productImage: {
    width: 100,
    height: 90,
    resizeMode: "contain",
  },
  infoContainer: {
    width: "75%",
    justifyContent: "space-between",
    paddingLeft: 25,
  },
  textRow: {
    flexDirection: "column",
    marginBottom: 5,
  },
  productName: {
    fontWeight: "500",
    fontSize: 22,
  },
  colorSizeRow: {
    flexDirection: "row",
    marginTop: 5
  },
  productColor: {
    color: "gray",
    fontSize: 18,
  },
  productSize: {
    fontSize: 18,
    color: "gray",
    marginLeft: 5
  },
  priceQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    color: "#333",
    fontSize: 25,
    fontWeight: "600",
  },
  productQuantity: {
    fontSize: 18,
  }
});

export default ItemInCart;
