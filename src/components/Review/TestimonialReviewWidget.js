import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import ReviewDetailModal from "./ReviewDetailModal";
import WidgetLoading from "../../components/Review/WidgetLoading";

const TestimonialReviewWidget = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === reviews.length - 1 ? 0 : prevIndex + 1;
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Customers Love Us</Text>
      <Text style={styles.subtitle}>Real feedback from our valued customers</Text>
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
              <Entypo name="quote" size={24} color={Colors.darkGray} />
              <TouchableOpacity
                onPress={() => {
                  // console.log("Selected Item:", item);
                  openModal(item);
                }}
              >
                <Text
                  style={styles.reviewContent}
                  numberOfLines={4}
                  ellipsizeMode="tail"
                >
                  {item.review_product}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "#f9f9f9",
    justifyContent: "space-between",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    width: 180,
    height: 200,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 30,
  },
  reviewContent: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
    gap: 3,
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
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
});
