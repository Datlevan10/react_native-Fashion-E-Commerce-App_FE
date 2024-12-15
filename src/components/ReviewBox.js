import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import Colors from "../styles/Color";
import ScoreBar from "./ScoreBar";

const ReviewBox = ({ reviews, onWriteReview }) => {
  const [filteredReviews, setFilteredReviews] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const onFilterReviews = (filter) => {
    console.log("Selected filter:", filter);
    switch (filter) {
      case "all":
        setFilteredReviews(reviews);
        break;
      case "helpful":
        setFilteredReviews(
          reviews.filter((review) => review.helpful_count > 0)
        );
        break;
      default:
        setFilteredReviews(
          reviews.filter((review) => review.star_rating === parseInt(filter))
        );
        break;
    }
  };

  const renderReview = ({ item }) => {
    const backgroundColor = getRandomColor();
    const textColor = getRandomColor();

    return (
      <View style={styles.reviewContainer}>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor }]}>
            <Text style={[styles.avatarText, { color: textColor }]}>
              {item.customer_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <View style={styles.reviewDateBox}>
              <MaterialIcons name="verified" size={12} color="#2196F3" />
              <Text style={styles.reviewDate}>{item.review_date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.starContainer}>
            {[...Array(item.stars_review)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={20}
                color={Colors.yellowColor}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewTitle}>{item.review_title}</Text>
        <Text style={styles.reviewContent}>{item.review_product}</Text>

        {item.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {item.media.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.reviewImage}
              />
            ))}
          </View>
        )}
        <View style={styles.row}>
          <TouchableOpacity style={styles.likeButton}>
            <AntDesign name="like1" size={18} color={Colors.grayColor} />
            <Text style={styles.likeCountText}>(0)</Text>
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerReview} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.reviewCard}>
        <View style={styles.statsContainer}>
          <View style={styles.averageReviewContainer}>
            <Text style={styles.averageReview}>
              {reviews[0]?.average_review || "0.0"}
            </Text>
            <FontAwesome
              name="star"
              size={25}
              color={Colors.yellowColor}
              style={styles.starIcon}
            />
          </View>

          <Text style={styles.totalReview}>
            {reviews[0]?.total_review || 0} Reviews
          </Text>
          <ScoreBar
            reviews={reviews}
            onFilterByStar={(star) => onFilterReviews(star.toString())}
          />
          <View style={styles.divider} />
          <Text style={styles.titleReviewCard}>Review this product</Text>
          <Text style={styles.subtitleReviewCard}>
            Share your thought with other customers
          </Text>
          <TouchableOpacity style={styles.button} onPress={onWriteReview}>
            <Text style={styles.buttonText}>Write a review</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.divider} /> */}
      <View style={styles.imageReviewContainer}>
        <Text style={styles.title}>Image from reviews</Text>
        <TouchableOpacity>
          <Text style={styles.allPhotos}>All photos</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Reviews with comments</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterButtonsContainer}
      >
        {[
          { label: "All", filter: "all" },
          { label: "Most helpful", filter: "helpful" },
          { label: "Highest rating", filter: "5" },
          { label: "Lowest rating", filter: "4" },
          { label: "Review with photo", filter: "3" },
          { label: "2 Stars", filter: "2" },
          { label: "1 Star", filter: "1" },
        ].map((button) => (
          <TouchableOpacity
            key={button.filter}
            style={styles.filterButton}
            onPress={() => onFilterReviews(button.filter)}
          >
            <Text style={styles.filterButtonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView>
        {reviews.map((item, index) => (
          <View key={item.review_id || index} style={styles.reviewContainer}>
            {renderReview({ item })}
          </View>
        ))}
      </ScrollView>

      {/* <FlatList
        data={reviews}
        keyExtractor={(item) => item.review_id}
        renderItem={renderReview}
        nestedScrollEnabled
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flex: 1,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    borderColor: "#e5e5e5",
    justifyContent: "center",
    paddingVertical: 20,
  },
  statsContainer: {
    marginBottom: 16,
  },
  averageReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  averageReview: {
    fontSize: 50,
    fontWeight: "500",
    textAlign: "center",
  },
  starIcon: {
    marginLeft: 2,
  },
  totalReview: {
    textAlign: "center",
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: "500",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterOption: {
    flex: 1,
    alignItems: "center",
  },
  filterOptionText: {
    fontSize: 12,
    color: "#555",
  },
  filterDivider: {
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
    marginTop: 4,
  },
  imageReviewContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
  },
  allPhotos: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "right",
    marginLeft: 5,
  },
  filterButtonsContainer: {
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  reviewContainer: {
    marginTop: 20,
    // padding: 16,
    // backgroundColor: "#f9f9f9",
    // borderRadius: 8,
  },
  row: {
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
    color: Colors.blackColor,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.indicatorDefaultColor,
    marginHorizontal: 10,
  },
  reportButton: {
    padding: 8,
  },
  reportText: {
    fontSize: 16,
    color: Colors.darkTextColor,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  reviewDateBox: {
    flexDirection: "row",
    gap: 3,
  },
  reviewDate: {
    fontSize: 14,
    color: "#555",
  },
  starContainer: {
    flexDirection: "row",
    gap: 3,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "500",
  },
  mediaContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  dividerReview: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 15,
  },
  titleReviewCard: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleReviewCard: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ReviewBox;
