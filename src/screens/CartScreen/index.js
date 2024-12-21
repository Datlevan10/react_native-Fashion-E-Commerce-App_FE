import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import FilterBox from "../../components/Other/FilterBox";
import CartForm from "../../components/Cart/CartForm";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../../styles/Color";
import { Linking } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import imageTest from "../../../assets/image/kid-2.jpg";
import imageTest1 from "../../../assets/image/kid-3.jpg";
import imageTest2 from "../../../assets/image/kid-4.jpg";
import imageTest3 from "../../../assets/image/kid-5.jpg";
import imageTest4 from "../../../assets/image/kid-6.jpg";
import imageTest5 from "../../../assets/image/kid-7.jpg";

const products = [
  {
    id: 1,
    productImage: imageTest,
    categoryName: "Dresses",
    productName: "Crinkled bow-detail dress",
    initialColor: "Blue",
    initialSize: "M",
    price: 299.99,
    initialQuantity: 1,
  },
  {
    id: 2,
    productImage: imageTest5,
    categoryName: "Dresses",
    productName: "Tulle dress",
    initialColor: "Red",
    initialSize: "L",
    price: 399.99,
    initialQuantity: 1,
  },
  {
    id: 3,
    productImage: imageTest2,
    categoryName: "Dresses",
    productName: "Polo dress",
    initialColor: "Green",
    initialSize: "S",
    price: 599.99,
    initialQuantity: 1,
  },
  // {
  //   id: 4,
  //   productImage: imageTest3,
  //   categoryName: "Electronics",
  //   productName: "Laptop",
  //   initialColor: "Green",
  //   initialSize: "S",
  //   price: 599.99,
  //   initialQuantity: 1,
  // },
];

const handleLearnMore = () => {
  Linking.openURL("https://yourwebsite.com/learn-more");
};

export default function CartScreen({ navigation }) {
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleSelectItem = (itemCount, itemPrice) => {
    setSelectedItemsCount(itemCount);
    setTotalAmount(itemCount * itemPrice);
  };

  const handleCheckout = () => {
    // console.log(
    //   "Checking out with",
    //   selectedItemsCount,
    //   "items for $",
    //   totalAmount
    // );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart Page</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.body}>
          <View style={styles.divider} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={false}
            nestedScrollEnabled={false}
            directionalLockEnabled={true}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox text="Sort" icon="keyboard-arrow-down" />
            <FilterBox text="Category" icon="keyboard-arrow-down" />
            <FilterBox text="Brand" icon="keyboard-arrow-down" />
            <FilterBox text="Men" icon="keyboard-arrow-down" />
            <FilterBox text="Women" icon="keyboard-arrow-down" />
          </ScrollView>
          <View style={styles.divider} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {products.map((product, index) => (
              <View key={product.id}>
                <CartForm
                  productImage={product.productImage}
                  categoryName={product.categoryName}
                  productName={product.productName}
                  initialColor={product.initialColor}
                  initialSize={product.initialSize}
                  price={product.price}
                  initialQuantity={product.initialQuantity}
                />
                {index !== products.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </ScrollView>
          <View style={styles.divider} />
          <View style={styles.freeShippingContainer}>
            <Text style={styles.freeShippingText}>
              You're <Text style={styles.amountText}>$51</Text> from{" "}
              <Text style={styles.flatRateText}>flat rate shipping</Text>. Save
              on shipping by adding an eligible item to cart.
            </Text>
            <TouchableOpacity
              onPress={handleLearnMore}
              style={styles.learnMoreButton}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryContainer}>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>
                {selectedItemsCount} Item{selectedItemsCount !== 1 ? "" : ""}
              </Text>
            </View>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountText}>
                ${totalAmount.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={handleCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
                {/* <MaterialIcons name="shopping-cart-checkout" size={22} color={Colors.whiteColor} /> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.blackColor,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
  },
  filterList: {
    flexDirection: "row",
    height: 55,
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  freeShippingContainer: {
    backgroundColor: Colors.lightGray,
    marginVertical: 10,
    alignItems: "flex-start",
  },
  freeShippingText: {
    fontSize: 17,
    color: Colors.blackColor,
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  flatRateText: {
    color: "#036f48",
  },
  learnMoreButton: {
    marginTop: 5,
    paddingVertical: 5,
  },
  learnMoreText: {
    color: "#036f48",
    fontWeight: "bold",
    fontSize: 18,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  itemCountContainer: {
    flex: 1,
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCountText: {
    fontSize: 20,
    color: Colors.darkGray,
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginRight: 10,
  },
  checkoutButton: {
    backgroundColor: "#036f48",
    flexDirection: "row",
    gap: 10,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  checkoutText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "bold",
  },
});
