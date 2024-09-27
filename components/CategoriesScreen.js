import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';
import category1Image from '../assets/women.jpg';
import category2Image from '../assets/men.jpg';
import category3Image from '../assets/teen.jpg';
import category4Image from '../assets/kid.jpg';

const CategoriesScreen = () => {
  const categories = [
    {
      id: 1,
      name: 'Women',
      imageSource: category1Image,
    },
    {
      id: 2,
      name: 'Men',
      imageSource: category2Image,
    },
    {
      id: 3,
      name: 'Teens',
      imageSource: category3Image,
    },
    {
      id: 4,
      name: 'Kids',
      imageSource: category4Image,
    },
  ];

  return (
    <View style={styles.container}>
      {categories.map(category => (
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // padding: 10,
  },
});

export default CategoriesScreen;
