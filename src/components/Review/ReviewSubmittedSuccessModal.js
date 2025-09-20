import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../../styles/Color";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import ConfettiCannon from "react-native-confetti-cannon";

const ReviewSubmittedSuccessModal = ({
  visible,
  onClose,
  productName,
  productImage,
  stars,
  title,
  content,
  media = [],
  customerName,
  customerEmail,
  discountValue = "10% OFF",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const confettiRef = useRef(null);

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      onBackdropPress={onClose}
      onModalShow={() => confettiRef.current?.start()}
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
                <View style={styles.stars}>
                  {Array.from({ length: stars }).map((_, index) => (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={28}
                      color={Colors.yellowColor}
                      style={styles.starIcon}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.reviewContainer}>
              <Text style={styles.reviewTitle}>{title}</Text>
              <Text style={styles.reviewContent}>{content}</Text>
            </View>

            {media.length > 0 && (
              <View style={styles.mediaContainer}>
                {media.map((file, index) => (
                  <Image
                    key={index}
                    source={{ uri: file.uri }}
                    style={styles.mediaImage}
                  />
                ))}
              </View>
            )}

            <View style={styles.reviewInfo}>
              <Text style={styles.customerName}>{customerName}</Text>
              <Text style={styles.customerEmail}>{customerEmail}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setIsLoading(true);
              onClose();
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfettiCannon
        count={300}
        origin={{ x: 200, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 15,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  discountIcon: {
    fontSize: 50,
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
    padding: 15,
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
    flexDirection: "row",
  },
  starIcon: {
    marginRight: 3,
  },
  reviewContainer: {
    marginTop: 10,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewContent: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  mediaImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  reviewInfo: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  customerName: {
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "500",
  },
  customerEmail: {
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
  closeButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bold: { fontWeight: "bold" },
});

export default ReviewSubmittedSuccessModal;
