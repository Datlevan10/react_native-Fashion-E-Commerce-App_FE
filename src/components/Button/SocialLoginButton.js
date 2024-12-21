import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const SocialLoginButton = ({ onPress, iconName, iconLibrary, buttonColor, buttonText }) => {
  const IconComponent = iconLibrary === "FontAwesome" ? FontAwesome : FontAwesome5;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: buttonColor }]}
    >
      <IconComponent name={iconName} size={22} color="#fff" />
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "500"
  },
});

export default SocialLoginButton;
