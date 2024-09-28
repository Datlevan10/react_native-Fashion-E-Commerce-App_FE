import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = ['#191925', '#0763b3', '#bad6ec'];

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>Colors</Text>
      </View>
      <View style={styles.colorRow}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorButton,
            ]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && (
              <Feather name="check" size={20} color="white"  />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  labelContainer: {
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#FFFFFF',
    // opacity: 0.9,
  },
  checkIcon: {
    position: 'absolute',
  },
});
