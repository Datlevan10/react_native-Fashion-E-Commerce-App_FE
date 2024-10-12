import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FilterBox from "../components/FilterBox";
import CartForm from "../components/CartForm";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../themes/Color";
import imageTest from "../assets/image/kid-2.jpg"
import imageTest1 from "../assets/image/kid-3.jpg"
import imageTest2 from "../assets/image/kid-4.jpg"
import imageTest3 from "../assets/image/kid-5.jpg"

export default function CartScreen({ navigation }) {
  return (
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
      {/* Nội dung khác của trang */}
      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          <FilterBox text="Sort" icon="keyboard-arrow-down" />
          <FilterBox text="Category" icon="keyboard-arrow-down" />
          <FilterBox text="Brand" icon="keyboard-arrow-down" />
          <FilterBox text="Men" icon="keyboard-arrow-down" />
        </ScrollView>
        
        <ScrollView>
          <CartForm
            productImage={imageTest}
            categoryName="Electronics"
            productName="Smartphone"
            initialColor="Blue"
            initialSize="M"
            price={299.99}
            initialQuantity={1}
          />
          <CartForm
            productImage={imageTest1}
            categoryName="Electronics"
            productName="Smartphone"
            initialColor="Blue"
            initialSize="M"
            price={299.99}
            initialQuantity={1}
          />
          <CartForm
            productImage={imageTest2}
            categoryName="Electronics"
            productName="Smartphone"
            initialColor="Blue"
            initialSize="M"
            price={299.99}
            initialQuantity={1}
          />
          <CartForm
            productImage={imageTest3}
            categoryName="Electronics"
            productName="Smartphone"
            initialColor="Blue"
            initialSize="M"
            price={299}
            initialQuantity={1}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
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
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  filterList: {
    height: 50,
    gap: 10,
    marginBottom: 30,
  },
});
