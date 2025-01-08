import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NoFilterResultModal = ({ imageSource}) => {
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});

export default NoFilterResultModal;
