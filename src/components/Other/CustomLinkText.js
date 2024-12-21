import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomLinkText = ({ text, highlightText, onPress, highlightColor }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {text}{" "}
        <Text
          style={[styles.highlight, { color: highlightColor || "#0098fd" }]}
          onPress={onPress}
        >
          {highlightText}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: "#555",
  },
  highlight: {
    fontWeight: "bold",
  },
});

export default CustomLinkText;
