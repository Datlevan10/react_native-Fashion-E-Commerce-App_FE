import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "react-native-vector-icons";

export default function PaymentMethod({
  icon,
  nameMethod,
  subTitle,
  isSelected,
}) {
  return (
    <View style={[styles.container, isSelected && styles.selectedContainer]}>
      <View style={styles.row}>
        <FontAwesome
          name={icon}
          size={24}
          style={styles.icon}
          color="#036f48"
        />
        <Text style={styles.methodName}>{nameMethod}</Text>
      </View>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 100,
    width: 230,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  selectedContainer: {
    borderColor: "#036f48",
    backgroundColor: "#e0f3eb",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  methodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 17,
    color: "#666",
  },
});
