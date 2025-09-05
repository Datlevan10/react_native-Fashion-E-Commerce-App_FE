import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Feather, MaterialIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../styles/Color';
import apiService from '../../api/ApiService';
import API_BASE_URL from '../../configs/config';

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    old_price: '',
    new_price: '',
    category_id: '',
    sizes: '',
    colors: '',
    quantity_in_stock: '',
    is_featured: false,
  });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiService.getAllProductsAdmin(currentPage, 20);
      
      if (response.status === 200) {
        const productsData = response.data.data || response.data.products || [];
        setProducts(refresh ? productsData : [...products, ...productsData]);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / 20) || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.status === 200) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchProducts(true);
  };

  const loadMoreProducts = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType?.Images || 'images', // Safe access with fallback
        allowsMultipleSelection: true,
        quality: 0.7,
        aspect: [1, 1],
      });

      if (!pickerResult.canceled) {
        setSelectedImages(pickerResult.assets || [pickerResult]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      product_name: '',
      description: '',
      old_price: '',
      new_price: '',
      category_id: '',
      sizes: '',
      colors: '',
      quantity_in_stock: '',
      is_featured: false,
    });
    setSelectedImages([]);
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    
    // Extract sizes from API format: [{"size": "0.5"}, {"size": "1"}] -> "0.5, 1"
    let sizesString = '';
    if (Array.isArray(product.size)) {
      sizesString = product.size.map(item => item.size || item).join(', ');
    }
    
    // Extract colors from API format: [{"color_code": "#C41E3A"}, {"color_code": "#FF0000"}] -> "#C41E3A, #FF0000"
    let colorsString = '';
    if (Array.isArray(product.color)) {
      colorsString = product.color.map(item => item.color_code || item).join(', ');
    }
    
    setFormData({
      product_name: product.product_name || '',
      description: product.description || '',
      old_price: product.old_price?.toString() || '',
      new_price: product.new_price?.toString() || '',
      category_id: product.category_id?.toString() || '',
      sizes: sizesString,
      colors: colorsString,
      quantity_in_stock: '',  // Keep UI field but don't use backend value
      is_featured: false,     // Keep UI field but don't use backend value
    });
    setSelectedImages([]);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.product_name.trim()) {
      Alert.alert('Validation Error', 'Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return false;
    }
    if (!formData.new_price || isNaN(formData.new_price)) {
      Alert.alert('Validation Error', 'Valid price is required');
      return false;
    }
    if (!formData.category_id) {
      Alert.alert('Validation Error', 'Category is required');
      return false;
    }
    if (!editingProduct && selectedImages.length === 0) {
      Alert.alert('Validation Error', 'At least one image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let dataToSend;
      let hasImages = selectedImages.length > 0;

      if (hasImages || !editingProduct) {
        // Use FormData for create (always) or update with new images
        const formDataToSend = new FormData();
        
        // Append basic form fields (exclude quantity_in_stock and is_featured - not in backend)
        formDataToSend.append('product_name', formData.product_name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('new_price', formData.new_price);
        
        if (formData.old_price) {
          formDataToSend.append('old_price', formData.old_price);
        }

        // Handle sizes - convert to array and append each individually
        if (formData.sizes) {
          const sizesArray = formData.sizes.split(',').map(item => item.trim()).filter(Boolean);
          sizesArray.forEach((size, index) => {
            formDataToSend.append(`size[${index}]`, size);
          });
        }

        // Handle colors - convert to array and append each individually  
        if (formData.colors) {
          const colorsArray = formData.colors.split(',').map(item => item.trim()).filter(Boolean);
          colorsArray.forEach((color, index) => {
            formDataToSend.append(`color[${index}]`, color);
          });
        }

        // Append images - backend expects 'image' not 'images'
        selectedImages.forEach((image, index) => {
          formDataToSend.append('image[]', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: `product_image_${index}.jpg`,
          });
        });

        dataToSend = formDataToSend;
      } else {
        // Use JSON for updates without new images
        dataToSend = {
          product_name: formData.product_name,
          description: formData.description,
          category_id: formData.category_id,
          new_price: formData.new_price,
        };
        
        if (formData.old_price) {
          dataToSend.old_price = formData.old_price;
        }
        
        if (formData.sizes) {
          dataToSend.size = formData.sizes.split(',').map(item => item.trim()).filter(Boolean);
        }
        
        if (formData.colors) {
          dataToSend.color = formData.colors.split(',').map(item => item.trim()).filter(Boolean);
        }
      }

      let response;
      if (editingProduct) {
        response = await apiService.updateProduct(editingProduct.product_id, dataToSend, hasImages);
      } else {
        response = await apiService.createProduct(dataToSend);
      }

      if (response.status === 200 || response.status === 201) {
        // Refresh data immediately
        await fetchProducts(true);
        
        // Close modal and show success message
        setModalVisible(false);
        Alert.alert(
          'Success',
          `Product ${editingProduct ? 'updated' : 'created'} successfully`
        );
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${product.product_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiService.deleteProduct(product.product_id);
              
              // Refresh data immediately
              await fetchProducts(true);
              
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter(product =>
    product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }) => {
    // Get the first image from the image array
    const firstImage = item.image && item.image.length > 0 ? item.image[0].url : null;
    
    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: firstImage ? `${API_BASE_URL}${firstImage}` : null }}
          style={styles.productImage}
          defaultSource={require('../../../assets/image/default_image.jpg')}
        />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.newPrice}>
            {new Intl.NumberFormat('vi-VN').format(item.new_price)} VND
          </Text>
          {item.old_price && item.old_price > item.new_price && (
            <Text style={styles.oldPrice}>
              {new Intl.NumberFormat('vi-VN').format(item.old_price)} VND
            </Text>
          )}
        </View>
        <Text style={styles.stockInfo}>
          Stock: {item.quantity_in_stock || 0}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditProduct(item)}
        >
          <Feather name="edit" size={16} color={Colors.whiteColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item)}
        >
          <Feather name="trash-2" size={16} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  const renderFormModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.saveButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Product Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.product_name}
              onChangeText={(text) => setFormData({...formData, product_name: text})}
              placeholder="Enter product name"
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Enter product description"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Prices */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>New Price *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.new_price}
                onChangeText={(text) => setFormData({...formData, new_price: text})}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Old Price</Text>
              <TextInput
                style={styles.textInput}
                value={formData.old_price}
                onChangeText={(text) => setFormData({...formData, old_price: text})}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerText}>
                {categories.find(cat => cat.category_id.toString() === formData.category_id)?.category_name || 'Select category'}
              </Text>
            </View>
            <ScrollView horizontal style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.category_id}
                  style={[
                    styles.categoryChip,
                    formData.category_id === category.category_id.toString() && styles.selectedCategoryChip
                  ]}
                  onPress={() => setFormData({...formData, category_id: category.category_id.toString()})}
                >
                  <Text style={[
                    styles.categoryChipText,
                    formData.category_id === category.category_id.toString() && styles.selectedCategoryChipText
                  ]}>
                    {category.category_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sizes and Colors */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sizes (comma separated)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.sizes}
              onChangeText={(text) => setFormData({...formData, sizes: text})}
              placeholder="S, M, L, XL"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Colors (comma separated)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.colors}
              onChangeText={(text) => setFormData({...formData, colors: text})}
              placeholder="Red, Blue, Green"
            />
          </View>

          {/* Stock */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Quantity in Stock</Text>
            <TextInput
              style={styles.textInput}
              value={formData.quantity_in_stock}
              onChangeText={(text) => setFormData({...formData, quantity_in_stock: text})}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* Images */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Images</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
              <Feather name="image" size={20} color={Colors.primary} />
              <Text style={styles.imagePickerText}>Select Images</Text>
            </TouchableOpacity>
            
            {selectedImages.length > 0 && (
              <ScrollView horizontal style={styles.imagePreviewContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                    >
                      <Feather name="x" size={12} color={Colors.whiteColor} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Featured Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, formData.is_featured && styles.toggleButtonActive]}
              onPress={() => setFormData({...formData, is_featured: !formData.is_featured})}
            >
              <Text style={[
                styles.toggleText,
                formData.is_featured && styles.toggleTextActive
              ]}>
                Featured Product
              </Text>
              <Feather
                name={formData.is_featured ? "check-circle" : "circle"}
                size={20}
                color={formData.is_featured ? Colors.whiteColor : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.product_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => 
          loading ? <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} /> : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.fabButton} onPress={handleAddProduct}>
        <Feather name="plus" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>

      {/* Form Modal */}
      {renderFormModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.blackColor,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.grayBgColor,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  stockInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    padding: 8,
    borderRadius: 6,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loader: {
    marginVertical: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.whiteColor,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.blackColor,
  },
  categoryList: {
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.blackColor,
  },
  selectedCategoryChipText: {
    color: Colors.whiteColor,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginTop: 12,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.blackColor,
  },
  toggleTextActive: {
    color: Colors.whiteColor,
  },
});

export default ProductManagementScreen;