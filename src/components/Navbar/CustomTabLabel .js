import React from "react";
import { Text, StyleSheet } from "react-native";

const CustomTabLabel = ({ label }) => {
  return <Text style={styles.label}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: "black",
    fontWeight: "500"
  },
});

export default CustomTabLabel;
