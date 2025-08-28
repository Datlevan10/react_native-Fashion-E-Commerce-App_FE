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
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import { Feather, MaterialIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../styles/Color';
import apiService from '../../api/ApiService';
import API_BASE_URL from '../../configs/config';

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    parent_category_id: null,
    sort_order: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiService.getCategories();
      
      if (response.status === 200) {
        const categoriesData = response.data.data || [];
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchCategories(true);
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
        allowsEditing: true,
        quality: 0.7,
        aspect: [1, 1],
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      category_name: '',
      description: '',
      parent_category_id: null,
      sort_order: '',
      is_active: true,
    });
    setSelectedImage(null);
    setModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name || '',
      description: category.description || '',
      parent_category_id: category.parent_category_id || null,
      sort_order: category.sort_order?.toString() || '',
      is_active: category.is_active !== false,
    });
    setSelectedImage(null);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.category_name.trim()) {
      Alert.alert('Validation Error', 'Category name is required');
      return false;
    }
    // For creating new category, image is required
    // For editing, image is optional if category already has one
    if (!editingCategory && !selectedImage) {
      Alert.alert('Validation Error', 'Category image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      
      // Append form fields
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sort_order', formData.sort_order || '0');
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      
      if (formData.parent_category_id) {
        formDataToSend.append('parent_category_id', formData.parent_category_id);
      }

      // Append image if selected
      if (selectedImage) {
        formDataToSend.append('image_category', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: 'image_category.jpg',
        });
      }

      let response;
      if (editingCategory) {
        // Update existing category
        response = await apiService.updateCategory(editingCategory.category_id, formDataToSend);
      } else {
        // Create new category
        response = await apiService.createCategory(formDataToSend);
      }

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success',
          `Category ${editingCategory ? 'updated' : 'created'} successfully`,
          [{ text: 'OK', onPress: () => {
            setModalVisible(false);
            handleRefresh();
          }}]
        );
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      console.log('Error details:', error.response?.data);
      
      let errorMessage = 'Failed to save category';
      if (error.response?.data?.error) {
        // Handle validation errors
        const errors = error.response.data.error;
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          errorMessage = errors[errorFields[0]][0]; // Get first error message
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (category) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${category.category_name}"?\n\nNote: This will also affect all products in this category.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.deleteCategory(category.category_id);
              
              if (response.status === 200) {
                Alert.alert(
                  'Success',
                  'Category deleted successfully',
                  [{ 
                    text: 'OK', 
                    onPress: () => handleRefresh()
                  }]
                );
              }
            } catch (error) {
              console.error('Error deleting category:', error);
              console.log('Error details:', error.response?.data);
              
              let errorMessage = 'Failed to delete category';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              
              Alert.alert('Error', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const filteredCategories = categories.filter(category =>
    category.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parent_category_id);
  };

  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parent_category_id === parentId);
  };

  const renderCategoryItem = ({ item }) => {
    const childCategories = getChildCategories(item.category_id);
    const hasChildren = childCategories.length > 0;
    
    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <View style={styles.categoryImageContainer}>
              {item.image_url ? (
                <Image
                  source={{ uri: `${API_BASE_URL}${item.image_url}` }}
                  style={styles.categoryImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialIcons name="category" size={32} color={Colors.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.category_name}
              </Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {item.description || 'No description'}
              </Text>
              <View style={styles.categoryMeta}>
                {hasChildren && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>{childCategories.length} subcategories</Text>
                  </View>
                )}
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.is_active ? Colors.success + '20' : Colors.error + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: item.is_active ? Colors.success : Colors.error }
                  ]}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditCategory(item)}
            >
              <Feather name="edit" size={16} color={Colors.whiteColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCategory(item)}
            >
              <Feather name="trash-2" size={16} color={Colors.whiteColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Show child categories if any */}
        {hasChildren && (
          <View style={styles.childCategoriesContainer}>
            <Text style={styles.childCategoriesTitle}>Subcategories:</Text>
            <View style={styles.childCategoriesList}>
              {childCategories.map((child) => (
                <TouchableOpacity
                  key={child.category_id}
                  style={styles.childCategoryChip}
                  onPress={() => handleEditCategory(child)}
                >
                  <Text style={styles.childCategoryText}>{child.category_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
            {editingCategory ? 'Edit Category' : 'Add New Category'}
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
          {/* Category Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.category_name}
              onChangeText={(text) => setFormData({...formData, category_name: text})}
              placeholder="Enter category name"
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Enter category description"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Parent Category */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Parent Category (Optional)</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerText}>
                {categories.find(cat => cat.category_id === formData.parent_category_id)?.category_name || 'None (Top Level)'}
              </Text>
            </View>
            <ScrollView horizontal style={styles.parentCategoryList}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !formData.parent_category_id && styles.selectedCategoryChip
                ]}
                onPress={() => setFormData({...formData, parent_category_id: null})}
              >
                <Text style={[
                  styles.categoryChipText,
                  !formData.parent_category_id && styles.selectedCategoryChipText
                ]}>
                  None
                </Text>
              </TouchableOpacity>
              {getParentCategories().map((category) => (
                <TouchableOpacity
                  key={category.category_id}
                  style={[
                    styles.categoryChip,
                    formData.parent_category_id === category.category_id && styles.selectedCategoryChip
                  ]}
                  onPress={() => setFormData({...formData, parent_category_id: category.category_id})}
                >
                  <Text style={[
                    styles.categoryChipText,
                    formData.parent_category_id === category.category_id && styles.selectedCategoryChipText
                  ]}>
                    {category.category_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sort Order */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sort Order</Text>
            <TextInput
              style={styles.textInput}
              value={formData.sort_order}
              onChangeText={(text) => setFormData({...formData, sort_order: text})}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* Category Image */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category Image</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
              <Feather name="image" size={20} color={Colors.primary} />
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
            
            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Feather name="x" size={12} color={Colors.whiteColor} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Active Status */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, formData.is_active && styles.toggleButtonActive]}
              onPress={() => setFormData({...formData, is_active: !formData.is_active})}
            >
              <Text style={[
                styles.toggleText,
                formData.is_active && styles.toggleTextActive
              ]}>
                Active Category
              </Text>
              <Feather
                name={formData.is_active ? "check-circle" : "circle"}
                size={20}
                color={formData.is_active ? Colors.whiteColor : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Group categories by parent for better display
  const topLevelCategories = filteredCategories.filter(cat => !cat.parent_category_id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category List */}
      <FlatList
        data={topLevelCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.category_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => 
          loading ? <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} /> : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="category" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.fabButton} onPress={handleAddCategory}>
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
  categoryCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryImageContainer: {
    marginRight: 12,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.grayBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadge: {
    backgroundColor: Colors.info + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.info,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
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
  childCategoriesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  childCategoriesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  childCategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  childCategoryChip: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  childCategoryText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
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
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.whiteColor,
    marginBottom: 8,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.blackColor,
  },
  parentCategoryList: {
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
    position: 'relative',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: 100,
    height: 100,
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

export default CategoryManagementScreen;