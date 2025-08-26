import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SelectShipping({ shippingMethod, estimatedTime, price }) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.shippingMethodText}>{shippingMethod}</Text>
        <Text style={styles.estimatedTimeText}>{estimatedTime}</Text>
      </View>
      <View style={styles.priceColumn}>
        <Text style={styles.priceText}>$ {price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
  },
  column: {
    flex: 1,
  },
  priceColumn: {
    justifyContent: 'center',
  },
  shippingMethodText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  estimatedTimeText: {
    fontSize: 17,
    color: '#555',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#036f48',
  },
});
