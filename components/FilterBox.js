import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../themes/Color";

const FilterBox = ({ text, icon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={18} color={Colors.blackColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.whiteBgColor,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 8,
    gap: 5,
  },
  iconContainer: {},
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.blackColor,
  },
});

export default FilterBox;
