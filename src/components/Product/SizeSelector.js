import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../styles/Color";

export default function SizeSelector({ sizes }) {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Size</Text>
      <View style={styles.sizeRow}>
        {sizes.map((size, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sizeButton,
              selectedSize === size && styles.selectedSizeButton,
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize === size && styles.selectedSizeText,
              ]}
            >
              {size}
            </Text>
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
  label: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 5,
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  sizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.whiteBgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSizeButton: {
    backgroundColor: Colors.darkBlack,
    borderColor: "transparent",
  },
  sizeText: {
    fontSize: 16,
    color: Colors.darkBlack,
  },
  selectedSizeText: {
    color: Colors.whiteColor,
  },
});
