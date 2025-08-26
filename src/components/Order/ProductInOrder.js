import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import * as Clipboard from "expo-clipboard";
import ShowAlertWithTitleContentAndOneActions from "../Alert/ShowAlertWithTitleContentAndOneActions ";

const ProductInOrder = ({ image, productName, description, orderId }) => {
  const copyToClipboard = () => {
    ShowAlertWithTitleContentAndOneActions(
      "Hề lôôô 🚚",
      "Vui lòng chuyển món đồ này đến Nguyễn Thanh Chúc giúp mình 🤣🤣🤣 "
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.productImage} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textRow}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.productDescription}>{description}</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderId}>ID Order: {orderId}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyIcon}>
            <Ionicons name="copy" size={20} color="#036f48" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  imageContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 90,
    resizeMode: "contain",
  },
  infoContainer: {
    width: "70%",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  textRow: {
    flexDirection: "column",
    marginBottom: 5,
  },
  productName: {
    fontWeight: "600",
    fontSize: 22,
  },
  productDescription: {
    color: "#555",
    fontSize: 18,
    marginTop: 5,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderId: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  copyIcon: {
    marginLeft: 10,
  },
});

export default ProductInOrder;
