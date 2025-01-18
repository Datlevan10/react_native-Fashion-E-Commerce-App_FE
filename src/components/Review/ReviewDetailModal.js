import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import API_BASE_URL from "../../configs/config";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

const ReviewDetailModal = ({ visible, onClose, review }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");

  //   console.log("Selected Review Data:", review);

  useEffect(() => {
    if (visible) {
      setAvatarColor(getRandomColor());
    }
  }, [visible]);

  const handleNextImage = () => {
    if (review?.media && currentImageIndex < review.media.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (!review) {
    return null;
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getContrastColor = (bgColor) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      onBackdropPress={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.allPhotosButton}>
            <MaterialIcons name="widgets" size={16} color="#000" />
            <Text style={styles.allPhotosText}>All photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                //   onPress={previousReview}
                style={styles.navigationLeft}
              >
                <AntDesign name="left" size={18} color={Colors.whiteBgColor} />
              </TouchableOpacity>
              {review.media && review.media.length > 0 ? (
                <>
                  <Image
                    source={{
                      uri: `${API_BASE_URL}${review.media[currentImageIndex]}`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {/* <View style={styles.imageNavigation}>
                    <TouchableOpacity
                      onPress={handlePreviousImage}
                      disabled={currentImageIndex === 0}
                    >
                      <AntDesign
                        name="left"
                        size={24}
                        color={currentImageIndex === 0 ? "#ccc" : "#000"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextImage}
                      disabled={currentImageIndex === review.media.length - 1}
                    >
                      <AntDesign
                        name="right"
                        size={24}
                        color={
                          currentImageIndex === review.media.length - 1
                            ? "#ccc"
                            : "#000"
                        }
                      />
                    </TouchableOpacity>
                  </View> */}
                </>
              ) : (
                <Text style={styles.noImageText}>No images available</Text>
              )}
              <TouchableOpacity
                // onPress={nextReview}
                style={styles.navigationRight}
              >
                <AntDesign name="right" size={16} color={Colors.whiteBgColor} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
              {/* <Text style={styles.sectionTitle}>Image from this review</Text> */}
              <ScrollView>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: getRandomColor() },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: getContrastColor(getRandomColor()) },
                      ]}
                    >
                      {`${review.customer_name
                        .trim()
                        .charAt(0)}${review.customer_name
                        .trim()
                        .split(" ")
                        .pop()
                        .charAt(0)}`}
                    </Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>
                      {review.customer_name}
                    </Text>
                    <View style={styles.reviewDateBox}>
                      <MaterialIcons
                        name="verified"
                        size={12}
                        color="#2196F3"
                      />
                      <Text style={styles.reviewDate}>
                        Review on {formatDate(review.review_date)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.starContainer}>
                  {[...Array(review.stars_review)].map((_, index) => (
                    <AntDesign
                      key={index}
                      name="star"
                      size={18}
                      color={Colors.yellowColor}
                    />
                  ))}
                </View>
                <Text style={styles.reviewTitle}>{review.review_title}</Text>
                <Text style={styles.reviewContent}>
                  {review.review_product}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.subtitleProduct}>Purchased item:</Text>
                <View style={styles.productInfoContainer}>
                  {review.product_image && review.product_image.length > 0 ? (
                    <>
                      {/* {console.log(
                        "Image URL:",
                        `${API_BASE_URL}${review.product_image[0].url}`
                      )} */}
                      <Image
                        source={{
                          uri: `${API_BASE_URL}${review.product_image[0].url}`,
                        }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </>
                  ) : (
                    <Text style={styles.noImageText}>
                      No product image available
                    </Text>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {review.product_name}
                    </Text>
                    <Text style={styles.productPrice}>
                      ${review.product_price}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportContainer}>
                  <TouchableOpacity style={styles.likeButton}>
                    <AntDesign name="like1" size={18} color={Colors.darkGray} />
                    <Text style={styles.likeCountText}>(0)</Text>
                  </TouchableOpacity>
                  <View style={styles.verticalDivider} />
                  <TouchableOpacity style={styles.reportButton}>
                    <MaterialIcons
                      name="flag"
                      size={18}
                      color={Colors.darkGray}
                    />
                    <Text style={styles.reportText}>Report</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    padding: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    // padding: 15,
  },
  imageNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "50%",
  },
  noImageText: {
    fontSize: 16,
    color: "#888",
  },
  navigationLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: Colors.darkGray,
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 2,
  },
  navigationRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: Colors.darkGray,
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 2,
  },
  detailsContainer: {
    flex: 1,
    marginTop: 10,
  },
  allPhotosButton: {
    flexDirection: "row",
    width: 90,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    // marginBottom: 10,
    justifyContent: "center",
  },
  allPhotosText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customerInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
  },
  reviewDateBox: {
    flexDirection: "row",
    gap: 3,
    marginTop: 3,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  starContainer: {
    flexDirection: "row",
    width: 120,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
  },
  productName: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
  },
  productInfo: {
    marginLeft: 10,
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 5,
  },
  likeCountText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.darkGray,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.indicatorDefaultColor,
    marginHorizontal: 10,
  },
  reportButton: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  reportText: {
    fontSize: 16,
    marginLeft: 5,
    color: Colors.darkGray,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
    color: "#555",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  reviewContent: {
    fontSize: 16,
    lineHeight: 20,
    color: "#555",
    marginBottom: 10,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  subtitleProduct: {
    fontSize: 16,
    fontWeight: "600",
  },
  productInfoContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
});

export default ReviewDetailModal;
