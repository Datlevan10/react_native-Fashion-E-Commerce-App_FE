import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../../styles/Color";

const FilterBox = ({ text, icon, onPress, isActive }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component style={[styles.container, isActive && styles.activeContainer]} onPress={onPress}>
      <Text style={[styles.text, isActive && styles.activeText]}>{text}</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={18} color={isActive ? Colors.whiteColor : Colors.blackColor} />
      </View>
    </Component>
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
  activeContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  iconContainer: {},
  text: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.blackColor,
  },
  activeText: {
    color: Colors.whiteColor,
  },
});

export default FilterBox;
