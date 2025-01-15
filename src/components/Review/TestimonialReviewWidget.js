import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const TestimonialReviewWidget = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

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
    }, 3000); // Thay đổi mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [reviews.length]);

  const previousReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Customers Love Us</Text>
      <View style={styles.reviewContainer}>
        <TouchableOpacity onPress={previousReview} style={styles.navigation}>
          <AntDesign name="left" size={18} color={Colors.whiteBgColor} />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={reviews}
          keyExtractor={(item) => item.review_id.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.reviewBox}>
              <Text style={styles.reviewContent}>{item.review_product}</Text>
              <Text style={styles.customerName}>{item.customer_name}</Text>
              <View style={styles.rating}>
                {[...Array(item.stars_review)].map((_, index) => (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={20}
                    color={Colors.yellowColor}
                  />
                ))}
              </View>
              {/* <Text style={styles.reviewDate}>
                {new Date(item.review_date).toLocaleDateString()}
              </Text> */}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          snapToInterval={220}
          snapToAlignment="start"
          decelerationRate="fast"
          onScrollToIndexFailed={() => {}}
        />
        <TouchableOpacity onPress={nextReview} style={styles.navigation}>
          <AntDesign name="right" size={16} color={Colors.whiteBgColor} />
        </TouchableOpacity>
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
    marginBottom: 10,
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
    borderRadius: 10,
    alignItems: "center",
    // marginRight: 10,
    width: 170,
    marginHorizontal: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 30,
  },
  reviewContent: {
    fontSize: 16,
    textAlign: "center",
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  navigation: {
    backgroundColor: Colors.darkGray,
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 0,
  },
});
