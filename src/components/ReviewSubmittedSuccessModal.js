import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../styles/Color";
import LottieView from "lottie-react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

const ReviewSubmittedSuccessModal = ({
  visible,
  onClose,
  productName,
  productImage,
  stars,
  title,
  content,
  customerName,
  customerEmail,
  discountValue = "10% OFF",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Thanks for your review. Your discount code is now Ready!
          </Text>
          <Text style={styles.subTitle}>
            Thank you for submitting your review. Your discount is ready and
            sent to your Email. Enjoy your exclusive offer.
          </Text>
          <Text style={styles.discountIcon}>🎉</Text>
          <Text style={styles.discountValue}>{discountValue}</Text>
          <View style={styles.reviewBox}>
            <View style={styles.productContainer}>
              <Image
                source={{ uri: productImage }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{productName}</Text>
                <Text style={styles.stars}>
                  {Array.from({ length: stars }).map((_, index) => (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={28}
                      color={Colors.yellowColor}
                    />
                  ))}
                </Text>
              </View>
            </View>

            <View style={styles.reviewContainer}>
              <Text style={styles.reviewTitle}>{title}</Text>
              <Text style={styles.reviewContent}>{content}</Text>
            </View>

            <View style={styles.reviewInfo}>
              <Text style={styles.customerName}>{customerName}</Text>
              <Text style={styles.customerEmail}>{customerEmail}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  discountIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  discountValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  reviewBox: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 78,
    height: 78,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stars: {
    marginTop: 10,
  },
  reviewContainer: {
    marginTop: 10,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewContent: {
    fontSize: 14,
    color: "gray",
  },
  reviewInfo: {
    marginTop: 10,
    alignItems: "flex-end",
    
  },
  customerName: {
    fontSize: 18,
  },
  customerEmail: {
    fontSize: 16,
    color: "gray",
  },
  closeButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ReviewSubmittedSuccessModal;
