import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../styles/Color";

const NoReviewBox = ({
  title = "Customer review",
  subtitle = "No review yet. Any feedback? Let us know",
  buttonText = "Write Review",
  onWriteReview,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.button} onPress={onWriteReview}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingVertical: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: "400",
    color: Colors.blackColor,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.blackColor,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NoReviewBox;
