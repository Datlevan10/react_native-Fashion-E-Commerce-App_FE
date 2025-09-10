import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import API_BASE_URL from "../../configs/config";

const { width } = Dimensions.get("window");

export default function ModernCartItem({
  item,
  onQuantityChange,
  onSizeChange,
  onRemove,
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityIncrease = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const newQuantity = item.quantity + 1;
    await onQuantityChange(item.cart_detail_id, newQuantity);
    setIsUpdating(false);
  };

  const handleQuantityDecrease = async () => {
    if (isUpdating || item.quantity <= 1) return;
    
    setIsUpdating(true);
    const newQuantity = item.quantity - 1;
    await onQuantityChange(item.cart_detail_id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemove(item.cart_detail_id),
        },
      ]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const imageSource = item.image ? 
    { uri: `${API_BASE_URL}${item.image}` } : 
    require("../../../assets/image/default_image.jpg");

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.productImage} resizeMode="cover" />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product_name}
            </Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>Khối lượng: {item.size} gam</Text>
              {item.color && item.color !== "N/A" && (
                <>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.detailText}>Color: {item.color}</Text>
                </>
              )}
            </View>
          </View>
          
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Feather name="trash-2" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.unitPrice}>{formatPrice(item.unit_price)}</Text>
            <Text style={styles.totalPrice}>{formatPrice(item.total_price)}</Text>
          </View>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, (item.quantity <= 1 || isUpdating) && styles.disabledButton]}
              onPress={handleQuantityDecrease}
              disabled={item.quantity <= 1 || isUpdating}
            >
              {isUpdating && item.quantity > 1 ? (
                <ActivityIndicator size="small" color={Colors.blackColor} />
              ) : (
                <Feather 
                  name="minus" 
                  size={18} 
                  color={item.quantity <= 1 ? Colors.lightGray : Colors.blackColor} 
                />
              )}
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.quantityButton, isUpdating && styles.disabledButton]}
              onPress={handleQuantityIncrease}
              disabled={isUpdating}
            >
              {isUpdating && item.quantity >= 1 ? (
                <ActivityIndicator size="small" color={Colors.blackColor} />
              ) : (
                <Feather name="plus" size={18} color={Colors.blackColor} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
    lineHeight: 22,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  separator: {
    fontSize: 14,
    color: Colors.darkGray,
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  unitPrice: {
    fontSize: 14,
    color: Colors.darkGray,
    textDecorationLine: "line-through",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.blackColor,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: Colors.whiteColor,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
});