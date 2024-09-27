import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CategoriesScreen from "./CategoriesScreen";

export default function HomeContentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.itemBar}>
        <Text style={styles.titleText}>Shop By Category</Text>
        <Text style={styles.moreText}>See All</Text>
      </View>
      <CategoriesScreen />
      <View style={styles.itemBar}>
        <Text style={styles.titleText}>Curated For You</Text>
        <Text style={styles.moreText}>See All</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
    // justifyContent: "center",
    // paddingHorizontal: 18
  },
  itemBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 18
  },
  titleText: {
    fontSize: 22,
    fontWeight: "500",
    color: "black",
  },
  moreText: {
    fontSize: 20,
    color: "grey",
  },
});
