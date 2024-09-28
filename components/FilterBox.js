import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FilterBox = ({ text, icon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={18} color="#333" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 8,
    gap: 5,
  },
  iconContainer: {},
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
});

export default FilterBox;
