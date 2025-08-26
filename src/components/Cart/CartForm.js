import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, AntDesign, MaterialIcons } from "react-native-vector-icons";

const CartForm = ({
  productImage,
  categoryName,
  productName,
  initialColor,
  initialSize,
  price,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [isChecked, setIsChecked] = useState(false);

  const sizes = ["S", "M", "L"];
  const colors = ["Red", "Blue", "Green"];

  const handleToggleSize = (direction) => {
    const currentIndex = sizes.indexOf(selectedSize);
    let newIndex;
    if (direction === "down") {
      newIndex = currentIndex + 1 < sizes.length ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : sizes.length - 1;
    }
    setSelectedSize(sizes[newIndex]);
  };

  const handleToggleColor = (direction) => {
    const currentIndex = colors.indexOf(selectedColor);
    let newIndex;
    if (direction === "down") {
      newIndex = currentIndex + 1 < colors.length ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : colors.length - 1;
    }
    setSelectedColor(colors[newIndex]);
  };

  const totalPrice = quantity * price;
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={styles.cartBox}>
      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={toggleCheckbox} style={styles.checkbox}>
              {isChecked ? (
                <Feather name="check-square" size={24} color="green" />
              ) : (
                <Feather name="square" size={24} color="black" />
              )}
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image source={productImage} style={styles.productImage} />
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.categoryText}>{categoryName}</Text>
          <Text style={styles.productText}>{productName}</Text>
          <View style={styles.optionRow}>
            <View style={styles.colorSelector}>
              <Text style={styles.sizeText}>{selectedColor}</Text>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => handleToggleColor("up")}
                  style={{ marginBottom: -4 }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-up"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleColor("down")}
                  style={{ marginTop: -4 }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.sizeSelector}>
              <Text style={styles.sizeText}>{selectedSize}</Text>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => handleToggleSize("up")}
                  style={{ marginBottom: -4 }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-up"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleSize("down")}
                  style={{ marginTop: -4 }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.priceText}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={decreaseQuantity}
            style={styles.decreaseButton}
          >
            <AntDesign name="minus" size={16} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={increaseQuantity}
            style={styles.increaseButton}
          >
            <AntDesign name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.text}>Move to Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <AntDesign name="delete" size={20} color="#d33415" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBox: {
    borderWidth: 1,
    borderColor: "#c5c6c8",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  column: {
    flex: 1,
    padding: 5,
    gap: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 70,
    height: 70,
    marginLeft: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "gray",
  },
  productText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  sizeSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  sizeText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    color: "#036f48",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  decreaseButton: {
    padding: 7,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
  },
  increaseButton: {
    padding: 7,
    backgroundColor: "#036f48",
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wishlistButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  text: {},
  deleteButton: {
    borderWidth: 1,
    borderColor: "#d33415",
    padding: 5,
    borderRadius: 5,
  },
});

export default CartForm;
