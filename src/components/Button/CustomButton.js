import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../../styles/Color";

export default function CustomButton({ title, onPress, backgroundColor }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
      padding: 15,
      width: 170,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.whiteColor,
    },
  });
