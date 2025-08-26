import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';

const CategoryForm = ({ categories = [], containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {categories.map((category) => (
        <CategoryItem
          key={category.categoryId}
          imageSource={category.imageCategory}
          categoryName={category.categoryName}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default CategoryForm;
