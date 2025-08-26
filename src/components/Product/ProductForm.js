import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const ProductForm = ({ imageSource }) => {
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <View style={styles.heartIconContainer}>
        <Feather name="heart" size={20} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.50,
    height: 200,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 9,
    position: 'relative',
  },
  image: {
    width: '150%',
    height: '150%',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#b4b3b3',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductForm;
