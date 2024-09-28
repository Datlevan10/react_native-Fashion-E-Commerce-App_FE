import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FilterBox from "../components/FilterBox";
import CategoryForm from "../components/CategoryForm";
import category1Image from "../assets/women.jpg";
import category2Image from "../assets/men.jpg";
import category3Image from "../assets/teen.jpg";
import category4Image from "../assets/kid.jpg";

const categories = [
  {
    id: 1,
    name: "Women",
    imageSource: category1Image,
  },
  {
    id: 2,
    name: "Men",
    imageSource: category2Image,
  },
  {
    id: 3,
    name: "Teens",
    imageSource: category3Image,
  },
  {
    id: 4,
    name: "Kids",
    imageSource: category4Image,
  },
];

const CategoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products with name, rating, size,..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox text="Filter" icon="filter-list" />
            <FilterBox text="Ratings" icon="keyboard-arrow-down" />
            <FilterBox text="Size" icon="keyboard-arrow-down" />
            <FilterBox text="Color" icon="keyboard-arrow-down" />
            <FilterBox text="Price" icon="keyboard-arrow-down" />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <CategoryForm
              categories={categories}
              containerStyle={styles.customContainer}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: "#f4f4f4",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 15,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f4f4f4",
    // borderWidth: 1,
    // borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  filterList: {
    gap: 5,
  },
});

export default CategoryScreen;
