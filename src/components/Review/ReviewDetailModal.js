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
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";
import Modal from "react-native-modal";
import {
  getRandomColor,
  getContrastColor,
} from "../../../src/utils/colorUtils";
import { formatDate } from "../../../src/utils/dateUtils";
import WidgetLoading from "./WidgetLoading";
import ReportReviewModal from "./ReportReviewModal";

const { width } = Dimensions.get("window");

const ReviewDetailModal = ({ visible, onClose, review }) => {
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      const randomColor = getRandomColor();
      setAvatarColor(randomColor);

      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
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

  const handleProductPress = async (productId) => {
    try {
      onClose();

      const response = await apiService.getProductByProductId(productId);
      const productDetails = response.data.data;

      navigation.push("ProductDetailScreen", {
        product: {
          productId: productDetails.product_id,
          productName: productDetails.product_name,
          productImage: productDetails.image.map(
            (img) => `${API_BASE_URL}${img.url}`
          ),
          description: productDetails.description,
          oldPrice: productDetails.old_price,
          newPrice: productDetails.new_price,
          averageReview: productDetails.average_review,
          totalReview: productDetails.total_review,
          colorArr: productDetails.color.map((color) => `${color.color_code}`),
          sizeArr: productDetails.size.map((size) => `${size.size}`),
        },
        images: productDetails.image.map((img) => `${API_BASE_URL}${img.url}`),
        colors: productDetails.color.map((color) => `${color.color_code}`),
        sizes: productDetails.size.map((size) => `${size.size}`),
      });
      console.log("Navigated to ProductDetailScreen");
    } catch (error) {
      console.error("Failed to load product details:", error);
    }
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
          {isLoading ? (
            <WidgetLoading />
          ) : (
            <View style={styles.contentContainer}>
              {review.media && review.media.length > 0 && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={handlePreviousImage}
                    style={styles.navigationLeft}
                  >
                    <AntDesign
                      name="left"
                      size={18}
                      color={Colors.whiteBgColor}
                    />
                  </TouchableOpacity>

                  <Image
                    source={{
                      uri: `${API_BASE_URL}${review.media[currentImageIndex]}`,
                    }}
                    style={styles.image}
                    resizeMode="contain"
                  />

                  <TouchableOpacity
                    onPress={handleNextImage}
                    style={styles.navigationRight}
                  >
                    <AntDesign
                      name="right"
                      size={16}
                      color={Colors.whiteBgColor}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {(!review.media || review.media.length === 0) && (
                // Handle lai cho nay
                <Text style={styles.noImageText}>No images available</Text>
              )}

              <View style={styles.detailsContainer}>
                <View style={styles.row}>
                  <View
                    style={[styles.avatar, { backgroundColor: avatarColor }]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: getContrastColor(avatarColor) },
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
                  {[...Array(5)].map((_, index) => (
                    <AntDesign
                      key={index}
                      name="star"
                      size={18}
                      color={
                        index < review.stars_review
                          ? Colors.yellowColor
                          : Colors.starColorNoRating
                      }
                    />
                  ))}
                </View>
                <Text style={styles.reviewTitle}>{review.review_title}</Text>
                <ScrollView style={{ maxHeight: 150 }}>
                  <Text style={styles.reviewContent}>
                    {review.review_product}
                  </Text>
                </ScrollView>
                <View style={styles.divider} />
                <Text style={styles.subtitleProduct}>Purchased item:</Text>
                <View style={styles.productInfoContainer}>
                  {review.product_image && review.product_image.length > 0 ? (
                    <>
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
                    <TouchableOpacity
                      onPress={() => handleProductPress(review.product_id)}
                    >
                      <Text style={styles.productName}>
                        {review.product_name}
                      </Text>
                    </TouchableOpacity>
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
                  <TouchableOpacity
                    style={styles.reportButton}
                    onPress={() => setModalVisible(true)}
                  >
                    <MaterialIcons
                      name="flag"
                      size={18}
                      color={Colors.darkGray}
                    />
                    <Text style={styles.reportText}>Report</Text>
                  </TouchableOpacity>
                  <ReportReviewModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    storeName="H&M"
                    // storeName={review.store_name}
                    onReportSubmit={(reason) => console.log(reason)}
                  />
                </View>
              </View>
            </View>
          )}
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
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
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
    textDecorationLine: "underline",
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
