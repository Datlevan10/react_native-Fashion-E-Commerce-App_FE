import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";

const ProfileStats = ({ totalOrders, totalIncome, totalViews }) => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Feather name="shopping-bag" size={22} color="#4CAF50" />
        <Text style={styles.value}>{totalOrders}</Text>
        <Text style={styles.title}>Total Orders</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.column}>
        <MaterialIcons name="attach-money" size={22} color="#FF9800" />
        <Text style={styles.value}>${totalIncome}</Text>
        <Text style={styles.title}>Total Income</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.column}>
        <AntDesign name="eye" size={22} color="#2196F3" />
        <Text style={styles.value}>{totalViews}</Text>
        <Text style={styles.title}>Total Views</Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 40,
    alignSelf: "center",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    color: "#777",
    marginTop: 4,
  },
});

export default ProfileStats;
