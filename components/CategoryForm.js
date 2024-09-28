import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';

const CategoryForm = ({ categories = [], containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          imageSource={category.imageSource}
          categoryName={category.name}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default CategoryForm;
