import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomLinkText = ({ text, highlightText, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {text}{" "}
        <Text style={styles.highlight} onPress={onPress}>
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
    color: "#0098fd",
  },
});

export default CustomLinkText;
