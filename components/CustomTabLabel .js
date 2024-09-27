import React from "react";
import { Text, StyleSheet } from "react-native";

const CustomTabLabel = ({ label }) => {
  return <Text style={styles.label}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "black",
  },
});

export default CustomTabLabel;
