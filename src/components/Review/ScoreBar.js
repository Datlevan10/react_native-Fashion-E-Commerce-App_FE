import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const ScoreBar = ({ reviews, onFilterByStar }) => {
  const calculateStarDistribution = () => {
    const totalReviews = reviews.length;
    const starCounts = [5, 4, 3, 2, 1].map(
      (star) => reviews.filter((review) => review.stars_review === star).length
    );

    return starCounts.map((count) => ({
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }));
  };

  const starDistribution = calculateStarDistribution();

  return (
    <View style={styles.scoreBarContainer}>
      {[5, 4, 3, 2, 1].map((star, index) => {
        const { count, percentage } = starDistribution[5 - star];
        return (
          <TouchableOpacity
            key={star}
            style={styles.scoreBarRow}
            onPress={() => onFilterByStar(star)}
          >
            <View style={styles.starRow}>
              <Text style={styles.starText}>{star}</Text>
              <FontAwesome name="star" size={14} color={Colors.yellowColor} />
            </View>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFilled,
                  {
                    width: `${percentage}%`,
                    backgroundColor:
                      percentage > 0 ? Colors.yellowColor : "#ccc",
                  },
                ]}
              />
            </View>
            <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ScoreBar;

const styles = StyleSheet.create({
  scoreBarContainer: {
    marginVertical: 10,
  },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    gap: 2
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 35,
  },
  starText: {
    marginRight: 3,
    fontSize: 16,
    color: Colors.blackColor,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  scoreBarFilled: {
    height: "100%",
    borderRadius: 5,
  },
  percentageText: {
    width: 35,
    fontSize: 16,
    color: Colors.blackColor,
    textAlign: "right",
  },
});
