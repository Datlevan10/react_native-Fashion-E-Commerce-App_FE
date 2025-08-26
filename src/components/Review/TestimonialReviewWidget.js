import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import ReviewDetailModal from "./ReviewDetailModal";
import API_BASE_URL from "../../configs/config";
import {
  getRandomColor,
  getContrastColor,
} from "../../../src/utils/colorUtils";
import { formatDate, formatDateLong } from "../../../src/utils/dateUtils";
import WidgetLoading from "../../components/Review/WidgetLoading";

const TestimonialReviewWidget = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === reviews.length - 1 ? 0 : prevIndex + 1;
        const randomColor = getRandomColor();
        setAvatarColor(randomColor);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: nextIndex,
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const openModal = (item) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedReview(item);
      setModalVisible(true);
      setIsLoading(false);
    }, 1000);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const previousReview = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? reviews.length - 1 : prevIndex - 1;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: newIndex,
        });
      }
      return newIndex;
    });
  };

  const nextReview = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === reviews.length - 1 ? 0 : prevIndex + 1;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: newIndex,
        });
      }
      return newIndex;
    });
  };

  const handleProductPress = async (productId) => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Customers Love Us</Text>
      <Text style={styles.subtitle}>
        Real feedback from our valued customers
      </Text>
      <View style={styles.reviewContainer}>
        <TouchableOpacity
          onPress={previousReview}
          style={styles.navigationLeft}
        >
          <AntDesign name="left" size={18} color={Colors.whiteBgColor} />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={reviews}
          keyExtractor={(item) => item.review_id.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.reviewBox}>
              <FontAwesome
                name="quote-left"
                size={24}
                color={Colors.darkGray}
              />
              <View>
                <TouchableOpacity
                  onPress={() => {
                    openModal(item);
                  }}
                >
                  <Text
                    style={styles.reviewContent}
                    numberOfLines={4}
                    ellipsizeMode="tail"
                  >
                    {`"${
                      item.review_product.length > 100
                        ? item.review_product.slice(0, 100) + '...More"'
                        : item.review_product + '"'
                    }`}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                <Text
                  style={[
                    styles.avatarText,
                    { color: getContrastColor(avatarColor) },
                  ]}
                >
                  {`${item.customer_name.trim().charAt(0)}${item.customer_name
                    .trim()
                    .split(" ")
                    .pop()
                    .charAt(0)}`}
                </Text>
              </View>
              <Text style={styles.customerName}>{item.customer_name}</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, index) => (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={16}
                    color={
                      index < item.stars_review
                        ? Colors.yellowColor
                        : Colors.starColorNoRating
                    }
                  />
                ))}
              </View>
              <View style={styles.productInfoContainer}>
                {item.product_image && item.product_image.length > 0 ? (
                  <>
                    <Image
                      source={{
                        uri: `${API_BASE_URL}${item.product_image[0].url}`,
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
                    onPress={() => handleProductPress(item.product_id)}
                  >
                    <Text style={styles.productName}>{item.product_name}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.reviewDate}>
                Reviewed on {formatDateLong(item.review_date)}
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          onScrollToIndexFailed={() => {}}
        />

        <TouchableOpacity onPress={nextReview} style={styles.navigationRight}>
          <AntDesign name="right" size={16} color={Colors.whiteBgColor} />
        </TouchableOpacity>

        {/* {isLoading ? (
          <WidgetLoading />
        ) : (
          <ReviewDetailModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            review={selectedReview}
          />
        )} */}
        <ReviewDetailModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          review={selectedReview}
        />
      </View>
    </View>
  );
};

export default TestimonialReviewWidget;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 18,
    color: Colors.blackColor,
    marginTop: 10,
    marginBottom: 20,
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  reviewBox: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.whiteColor,
    justifyContent: "space-between",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.borderWidgetTestimonial,
    alignItems: "center",
    marginRight: 20,
    width: 270,
    height: 300,
  },
  productInfoContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 0,
    color: Colors.blackWidgetTestimonial,
  },
  reviewContent: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    color: Colors.grayWidgetTestimonial,
  },
  rating: {
    flexDirection: "row",
    marginTop: 0,
    gap: 3,
  },
  reviewDate: {
    fontSize: 16,
    color: Colors.grayWidgetTestimonial,
  },
  navigationLeft: {
    backgroundColor: Colors.darkGray,
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    left: -7,
  },
  navigationRight: {
    backgroundColor: Colors.darkGray,
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    right: -7,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "500",
    color: Colors.blackWidgetTestimonial,
  },
});
