import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import ProductCard from "../../components/Product/ProductCard";
import { Feather, MaterialIcons } from "react-native-vector-icons";
import FilterBox from "../../components/Other/FilterBox";
import FilterModal from "../../components/Filter/FilterModal";
import CategoryForm from "../../components/Category/CategoryForm";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const ExploreScreen = ({ navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    rating: null,
    size: null,
    price: null,
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState(null);

  const ratingOptions = [
    { value: 5, label: "5 Stars ⭐" },
    { value: 4, label: "4 Stars ⭐" },
    { value: 3, label: "3 Stars ⭐" },
    { value: 2, label: "2 Stars ⭐" },
    { value: 1, label: "1 Star ⭐" },
  ];

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  const priceOptions = [
    { value: { max: 50 }, label: "Under $50" },
    { value: { min: 50, max: 100 }, label: "$50 - $100" },
    { value: { min: 100, max: 200 }, label: "$100 - $200" },
    { value: { min: 200, max: 500 }, label: "$200 - $500" },
    { value: { min: 500 }, label: "Over $500" },
  ];

  useEffect(() => {
    // load data
    loadStoreName();
    loadCategories();
    loadListAllProducts();
  }, []);

  const loadStoreName = async () => {
    try {
      const response = await apiService.getStores();
      if (response && response.data.data && response.data.data[0]) {
        setStoreName(response.data.data[0].store_name);
      }
    } catch (error) {
      console.error("Failed to load store name:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(
        response.data.data.map((item) => ({
          categoryId: item.category_id,
          categoryName: item.category_name,
          imageCategory: {
            uri: `${API_BASE_URL}${item.image_category}`,
          },
        }))
      );
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadListAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getListAllProducts();
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        throw new Error("API response.data is not an array");
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      loadListAllProducts();
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.searchProducts(keyword);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        setProducts([]);
        return;
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to search products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterByRating = async (rating) => {
    try {
      setIsLoading(true);
      setActiveFilters({ ...activeFilters, rating });
      const response = await apiService.filterProductsByStars(rating);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        setProducts([]);
        return;
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to filter by rating:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterBySize = async (size) => {
    try {
      setIsLoading(true);
      setActiveFilters({ ...activeFilters, size });
      const response = await apiService.filterProductsBySizes(size);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        setProducts([]);
        return;
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to filter by size:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterByPrice = async (priceRange) => {
    try {
      setIsLoading(true);
      setActiveFilters({ ...activeFilters, price: priceRange });
      const response = await apiService.filterProductsByPrice(priceRange.min, priceRange.max);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        setProducts([]);
        return;
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to filter by price:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate("CategoryProductsScreen", { 
      categoryId,
      categoryName: categories.find(cat => cat.categoryId === categoryId)?.categoryName 
    });
  };

  const getPriceRangeLabel = (priceRange) => {
    if (priceRange.max && !priceRange.min) return `Under $${priceRange.max}`;
    if (priceRange.min && !priceRange.max) return `Over $${priceRange.min}`;
    if (priceRange.min && priceRange.max) return `$${priceRange.min} - $${priceRange.max}`;
    return "Price";
  };

  const clearFilters = () => {
    setActiveFilters({ rating: null, size: null, price: null });
    setSearchKeyword("");
    loadListAllProducts();
  };

  const openFilterModal = (type) => {
    setFilterType(type);
    setShowFilterModal(true);
  };

  const handleFilterSelect = (value) => {
    if (filterType === 'rating') {
      setActiveFilters({ ...activeFilters, rating: value });
      if (value) {
        handleFilterByRating(value);
      } else {
        loadListAllProducts();
      }
    } else if (filterType === 'size') {
      setActiveFilters({ ...activeFilters, size: value });
      if (value) {
        handleFilterBySize(value);
      } else {
        loadListAllProducts();
      }
    } else if (filterType === 'price') {
      setActiveFilters({ ...activeFilters, price: value });
      if (value) {
        handleFilterByPrice(value);
      } else {
        loadListAllProducts();
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
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
              placeholder="Search products..."
              placeholderTextColor="#999"
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              onSubmitEditing={() => handleSearch(searchKeyword)}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity>
            <View style={styles.micContainer}>
              <MaterialIcons
                name="mic"
                size={22}
                color="#333"
                // style={styles.micIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox 
              text="Clear All" 
              icon="clear" 
              onPress={clearFilters}
              isActive={activeFilters.rating || activeFilters.size || activeFilters.price}
            />
            <FilterBox 
              text={activeFilters.rating ? `${activeFilters.rating} Stars` : "Ratings"} 
              icon="keyboard-arrow-down" 
              onPress={() => openFilterModal('rating')}
              isActive={activeFilters.rating !== null}
            />
            <FilterBox 
              text={activeFilters.size ? activeFilters.size : "Size"} 
              icon="keyboard-arrow-down" 
              onPress={() => openFilterModal('size')}
              isActive={activeFilters.size !== null}
            />
            <FilterBox 
              text={activeFilters.price ? getPriceRangeLabel(activeFilters.price) : "Price"} 
              icon="keyboard-arrow-down" 
              onPress={() => openFilterModal('price')}
              isActive={activeFilters.price !== null}
            />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <CategoryForm
              categories={categories}
              containerStyle={styles.customContainer}
              onCategoryPress={handleCategoryPress}
            />
          </ScrollView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            ) : (
              <View style={styles.productContainer}>
                {products.map((product, index) => (
                <ProductCard
                  key={product.productId}
                  imageSource={product.productImage}
                  storeName={storeName}
                  // categoryName={product.categoryName}
                  averageReview={product.averageReview}
                  totalReview={product.totalReview}
                  productName={product.productName}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  color={product.colorArr}
                  size={product.sizeArr}
                  onPress={() =>
                    navigation.navigate("ProductDetailScreen", {
                      product,
                      images: product.imageArr,
                      colors: product.colorArr,
                      sizes: product.sizeArr,
                    })
                  }
                  cardWidth={Dimensions.get("window").width * 0.43}
                  imageWidth={"125%"}
                  imageHeight={"125%"}
                />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
        
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          title={filterType === 'rating' ? 'Ratings' : filterType === 'size' ? 'Sizes' : 'Price Range'}
          options={
            filterType === 'rating' ? ratingOptions : 
            filterType === 'size' ? sizeOptions : 
            priceOptions
          }
          selectedValue={
            filterType === 'rating' ? activeFilters.rating : 
            filterType === 'size' ? activeFilters.size :
            activeFilters.price
          }
          onSelect={handleFilterSelect}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: Colors.grayBgColor,
    backgroundColor: Colors.whiteColor,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.blackColor,
  },
  micContainer: {
    height: 35,
    width: 35,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  filterList: {
    height: 40,
    gap: 5,
    marginBottom: 30,
  },
  productList: {
    // paddingVertical: 10,
    marginBottom: 50,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

export default ExploreScreen;
