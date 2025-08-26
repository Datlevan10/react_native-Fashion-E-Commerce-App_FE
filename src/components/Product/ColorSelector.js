import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../../styles/Color";

export default function ColorSelector({ colors, onColorSelect }) {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>Colors</Text>
      <View style={styles.colorRow}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorButton,
            ]}
            onPress={() => handleColorSelect(color)}
          >
            {selectedColor === color && (
              <Feather name="check" size={20} color={Colors.whiteColor} />
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
    fontSize: 18,
    fontWeight: "400",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorButton: {
    borderColor: Colors.whiteColor,
    // opacity: 0.9,
  },
  checkIcon: {
    position: "absolute",
  },
});
