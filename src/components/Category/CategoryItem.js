import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CategoryItem = ({ imageSource, categoryName, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.categoryName}>{categoryName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // margin: 10,
    // paddingHorizontal: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CategoryItem;
