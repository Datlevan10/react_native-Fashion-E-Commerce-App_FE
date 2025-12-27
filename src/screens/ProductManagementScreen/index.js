import React, { useState, useEffect } from "react";
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
    Platform,
} from "react-native";
import { Feather, MaterialIcons } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as DocumentPicker from "expo-document-picker";
import SimpleColorPicker from "../../components/ColorPicker/SimpleColorPicker";
import WheelColorPicker from "../../components/ColorPicker/WheelColorPicker";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const ProductManagementScreen = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        old_price: "",
        new_price: "",
        category_id: "",
        sizes: "",
        colors: "",
        variants: "",
        note: "",
        quantity_in_stock: "",
        is_featured: false,
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isWheelColorPickerVisible, setIsWheelColorPickerVisible] =
        useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [currentPage]);

    const fetchProducts = async (refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else setLoading(true);

            const response = await apiService.getAllProductsAdmin(
                currentPage,
                20
            );

            if (response.status === 200) {
                const productsData =
                    response.data.data || response.data.products || [];

                if (refresh) {
                    setProducts(productsData);
                } else {
                    // Filter out duplicates when appending new products
                    const existingIds = new Set(
                        products.map((p) => p.product_id)
                    );
                    const newProducts = productsData.filter(
                        (p) => !existingIds.has(p.product_id)
                    );
                    setProducts([...products, ...newProducts]);
                }

                setTotalPages(
                    response.data.totalPages ||
                        Math.ceil(response.data.total / 20) ||
                        1
                );
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            Alert.alert("Error", "Failed to load products");
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
            console.error("Error fetching categories:", error);
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
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert(
                    "Permission Required",
                    "Please grant camera roll permissions to upload images."
                );
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType?.Images || ["images"],
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [4, 3],
                allowsEditing: false,
                exif: false,
                base64: false,
            });

            if (!pickerResult.canceled) {
                setSelectedImages(pickerResult.assets || [pickerResult]);
            }
        } catch (error) {
            console.error("Error picking images:", error);
            Alert.alert("Error", "Failed to pick images");
        }
    };

    const handleDocumentPicker = async () => {
        try {
            // Use Document Picker to select images from Files app
            const result = await DocumentPicker.getDocumentAsync({
                type: ["image/*"], // Accept all image types
                multiple: true, // Allow multiple selection
                copyToCacheDirectory: true, // Copy to cache for processing
            });

            if (!result.canceled && result.assets) {
                // Convert DocumentPicker format to match ImagePicker format
                const images = result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    type: asset.mimeType || "image/jpeg",
                    fileName: asset.name || `image_${index}.jpg`,
                    // Add these for compatibility with existing code
                    width: 1000,
                    height: 1000,
                }));

                setSelectedImages(images);
                console.log("Selected images from Files app:", images.length);
            }
        } catch (error) {
            console.error("Error picking documents:", error);
            Alert.alert("Error", "Failed to pick images from Files app");
        }
    };

    const showImagePickerOptions = () => {
        Alert.alert(
            "Chọn ảnh từ",
            "Chọn nguồn ảnh",
            [
                {
                    text: "Ứng dụng Tệp (Được đề xuất)",
                    onPress: handleDocumentPicker,
                },
                {
                    text: "Bộ sưu tập ảnh",
                    onPress: handleImagePicker,
                },
                {
                    text: "Hủy",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData({
            product_name: "",
            description: "",
            old_price: "",
            new_price: "",
            category_id: "",
            sizes: "",
            colors: "",
            variants: "",
            note: "",
            quantity_in_stock: "",
            is_featured: false,
        });
        setSelectedImages([]);
        setModalVisible(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);

        // Extract sizes from API format: [{"size": "0.5"}, {"size": "1"}] -> "0.5, 1"
        let sizesString = "";
        if (Array.isArray(product.size)) {
            sizesString = product.size
                .map((item) => item.size || item)
                .join(", ");
        }

        // Extract colors from API format: [{"color_code": "#C41E3A"}, {"color_code": "#FF0000"}] -> "#C41E3A, #FF0000"
        let colorsString = "";
        if (Array.isArray(product.color)) {
            colorsString = product.color
                .map((item) => item.color_code || item)
                .join(", ");
        }

        // Extract variants from API format: ["256GB", "512GB"] -> "256GB, 512GB"
        let variantsString = "";
        if (Array.isArray(product.variant)) {
            variantsString = product.variant.join(", ");
        }

        setFormData({
            product_name: product.product_name || "",
            description: product.description || "",
            old_price: product.old_price?.toString() || "",
            new_price: product.new_price?.toString() || "",
            category_id: product.category_id?.toString() || "",
            sizes: sizesString,
            colors: colorsString,
            variants: variantsString,
            note: product.note || "",
            quantity_in_stock: product.quantity_in_stock?.toString() || "",
            is_featured: false, // Keep UI field but don't use backend value
        });
        setSelectedImages([]);
        setModalVisible(true);
    };

    // Convert image to JPEG format using ImageManipulator
    const convertToJpeg = async (uri) => {
        try {
            const result = await ImageManipulator.manipulateAsync(uri, [], {
                compress: 0.8,
                format: ImageManipulator.SaveFormat.JPEG,
            });
            return result.uri;
        } catch (error) {
            console.error("Error converting image to JPEG:", error);
            return uri; // Return original URI if conversion fails
        }
    };

    const validateForm = () => {
        if (!formData.product_name.trim()) {
            Alert.alert("Validation Error", "Product name is required");
            return false;
        }
        if (!formData.description.trim()) {
            Alert.alert("Validation Error", "Description is required");
            return false;
        }
        if (!formData.new_price || isNaN(formData.new_price)) {
            Alert.alert("Validation Error", "Valid price is required");
            return false;
        }
        if (!formData.category_id) {
            Alert.alert("Validation Error", "Category is required");
            return false;
        }
        // Validate quantity_in_stock if provided
        if (
            formData.quantity_in_stock &&
            (isNaN(formData.quantity_in_stock) ||
                parseInt(formData.quantity_in_stock) < 0)
        ) {
            Alert.alert(
                "Validation Error",
                "Số lượng trong kho phải là số không âm"
            );
            return false;
        }
        if (!editingProduct && selectedImages.length === 0) {
            Alert.alert("Validation Error", "At least one image is required");
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

                // For updates with images, add _method field first
                if (editingProduct && hasImages) {
                    formDataToSend.append("_method", "PUT");
                }

                // Append basic form fields
                formDataToSend.append("product_name", formData.product_name);
                formDataToSend.append("description", formData.description);
                formDataToSend.append("category_id", formData.category_id);
                formDataToSend.append("new_price", formData.new_price);

                // Add quantity_in_stock if provided
                if (formData.quantity_in_stock) {
                    formDataToSend.append(
                        "quantity_in_stock",
                        formData.quantity_in_stock
                    );
                }

                if (formData.old_price) {
                    formDataToSend.append("old_price", formData.old_price);
                }

                // Declare arrays outside to use in logging
                let sizesArray = [];
                let colorsArray = [];

                // Handle sizes - backend expects simple array of strings
                if (formData.sizes) {
                    sizesArray = formData.sizes
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                    // Send as simple array values
                    sizesArray.forEach((size, index) => {
                        formDataToSend.append(`size[]`, size);
                    });
                }

                // Handle colors - ensure they have # prefix for hex codes
                if (formData.colors) {
                    colorsArray = formData.colors
                        .split(",")
                        .map((item) => {
                            const color = item.trim();
                            // Add # if it's a hex code without #
                            if (color && /^[0-9A-Fa-f]{6}$/.test(color)) {
                                return `#${color}`;
                            }
                            return color;
                        })
                        .filter(Boolean);

                    // Send as simple array values - backend expects array of strings
                    colorsArray.forEach((color, index) => {
                        formDataToSend.append(`color[]`, color);
                    });
                }

                // Handle variants - convert to array and append each individually
                if (formData.variants) {
                    const variantsArray = formData.variants
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                    variantsArray.forEach((variant, index) => {
                        formDataToSend.append(`variant[]`, variant);
                    });
                }

                // Add note if provided
                if (formData.note) {
                    formDataToSend.append("note", formData.note);
                }

                // Convert and append images - backend only accepts jpeg/jpg/png
                for (let i = 0; i < selectedImages.length; i++) {
                    const image = selectedImages[i];

                    // Check if image is HEIC format
                    const fileExtension = image.uri
                        .split(".")
                        .pop()
                        .toLowerCase();
                    let finalUri = image.uri;
                    let mimeType = "image/jpeg";
                    let fileName = `product_image_${i}.jpg`;

                    if (fileExtension === "heic" || fileExtension === "heif") {
                        // Convert HEIC to JPEG
                        console.log(`Converting HEIC image ${i} to JPEG...`);
                        finalUri = await convertToJpeg(image.uri);
                        console.log(`Converted image ${i} URI:`, finalUri);
                    } else if (fileExtension === "png") {
                        // Keep PNG as is
                        mimeType = "image/png";
                        fileName = `product_image_${i}.png`;
                    }

                    // React Native FormData requires this specific format for file uploads
                    // The key is to ensure the URI is properly formatted
                    const imageFile = {
                        uri: finalUri,
                        type: mimeType,
                        name: fileName,
                    };

                    // Append using React Native's FormData format
                    formDataToSend.append("image[]", imageFile);

                    console.log(`Image ${i} appended as 'image[]':`, {
                        uri: finalUri,
                        name: fileName,
                        type: mimeType,
                    });
                }

                // Log the FormData contents for debugging
                console.log("FormData being sent:");
                if (editingProduct && hasImages) {
                    console.log("- _method: PUT (for update with images)");
                }
                console.log("- product_name:", formData.product_name);
                console.log("- category_id:", formData.category_id);
                console.log(
                    "- sizes (array of strings):",
                    sizesArray.length > 0 ? sizesArray : "No sizes"
                );
                console.log(
                    "- colors (array of strings):",
                    colorsArray.length > 0 ? colorsArray : "No colors"
                );
                console.log("- images count:", selectedImages.length);
                console.log("- All data formatted and ready for upload");

                dataToSend = formDataToSend;
            } else {
                // Use JSON for updates without new images
                dataToSend = {
                    product_name: formData.product_name,
                    description: formData.description,
                    category_id: formData.category_id,
                    new_price: formData.new_price,
                };

                // Add quantity_in_stock if provided
                if (formData.quantity_in_stock) {
                    dataToSend.quantity_in_stock = parseInt(
                        formData.quantity_in_stock,
                        10
                    );
                }

                if (formData.old_price) {
                    dataToSend.old_price = formData.old_price;
                }

                if (formData.sizes) {
                    // Backend expects simple array of strings, not objects
                    dataToSend.size = formData.sizes
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean); // Just array of strings
                }

                if (formData.colors) {
                    // Backend expects simple array of strings, not objects
                    dataToSend.color = formData.colors
                        .split(",")
                        .map((item) => {
                            const color = item.trim();
                            // Add # if it's a hex code without #
                            if (color && /^[0-9A-Fa-f]{6}$/.test(color)) {
                                return `#${color}`;
                            }
                            return color;
                        })
                        .filter(Boolean); // Just array of strings
                }

                // Log the JSON data for debugging
                console.log("JSON data being sent:");
                console.log("- size format:", dataToSend.size);
                console.log("- color format:", dataToSend.color);
            }

            let response;
            if (editingProduct) {
                response = await apiService.updateProduct(
                    editingProduct.product_id,
                    dataToSend,
                    hasImages
                );
            } else {
                response = await apiService.createProduct(dataToSend);
            }

            if (response.status === 200 || response.status === 201) {
                // Refresh data immediately
                await fetchProducts(true);

                // Close modal and show success message
                setModalVisible(false);
                Alert.alert(
                    "Thành công",
                    `Sản phẩm ${
                        editingProduct ? "đã cập nhật" : "tạo"
                    } thành công`
                );
            }
        } catch (error) {
            console.error("Error submitting product:", error);

            // Log detailed error information
            if (error.response?.data) {
                console.log(
                    "Error details:",
                    JSON.stringify(error.response.data, null, 2)
                );
            }

            let errorMessage = "Failed to save product";
            if (error.response?.data?.error) {
                // Format validation errors
                const errors = error.response.data.error;
                const errorMessages = [];
                for (const field in errors) {
                    errorMessages.push(`${field}: ${errors[field].join(", ")}`);
                }
                errorMessage = errorMessages.join("\n");
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = (product) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete "${product.product_name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await apiService.deleteProduct(product.product_id);

                            // Refresh data immediately
                            await fetchProducts(true);

                            Alert.alert(
                                "Success",
                                "Product deleted successfully"
                            );
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("Error", "Failed to delete product");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const filteredProducts = products.filter(
        (product) =>
            product.product_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            product.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const renderProductItem = ({ item }) => {
        // Get the first image from the image array
        const firstImage =
            item.image && item.image.length > 0 ? item.image[0].url : null;

        return (
            <View style={styles.productCard}>
                <Image
                    source={{
                        uri: firstImage ? `${API_BASE_URL}${firstImage}` : null,
                    }}
                    style={styles.productImage}
                    defaultSource={require("../../../assets/image/default_image.jpg")}
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
                            {new Intl.NumberFormat("vi-VN").format(
                                item.new_price
                            )}{" "}
                            VND
                        </Text>
                        {item.old_price && item.old_price > item.new_price && (
                            <Text style={styles.oldPrice}>
                                {new Intl.NumberFormat("vi-VN").format(
                                    item.old_price
                                )}{" "}
                                VND
                            </Text>
                        )}
                    </View>
                    <Text style={styles.stockInfo}>
                        Tồn kho: {item.quantity_in_stock || 0}
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditProduct(item)}
                    >
                        <Feather
                            name="edit"
                            size={16}
                            color={Colors.whiteColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteProduct(item)}
                    >
                        <Feather
                            name="trash-2"
                            size={16}
                            color={Colors.whiteColor}
                        />
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
                        {editingProduct
                            ? "Chỉnh sửa sản phẩm"
                            : "Thêm sản phẩm mới"}
                    </Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color={Colors.primary}
                            />
                        ) : (
                            <Text style={styles.saveButtonText}>Lưu</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Product Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Tên sản phẩm *</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.product_name}
                            onChangeText={(text) =>
                                setFormData({ ...formData, product_name: text })
                            }
                            placeholder="Nhập tên sản phẩm"
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mô tả *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.description}
                            onChangeText={(text) =>
                                setFormData({ ...formData, description: text })
                            }
                            placeholder="Nhập mô tả sản phẩm"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Prices */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.inputLabel}>Giá mới *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.new_price}
                                onChangeText={(text) =>
                                    setFormData({
                                        ...formData,
                                        new_price: text,
                                    })
                                }
                                placeholder="0"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.inputLabel}>Giá cũ</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.old_price}
                                onChangeText={(text) =>
                                    setFormData({
                                        ...formData,
                                        old_price: text,
                                    })
                                }
                                placeholder="0"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Quantity in Stock */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                            Số lượng trong kho
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.quantity_in_stock}
                            onChangeText={(text) =>
                                setFormData({
                                    ...formData,
                                    quantity_in_stock: text,
                                })
                            }
                            placeholder="0"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Danh mục *</Text>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerText}>
                                {categories.find(
                                    (cat) =>
                                        cat.category_id.toString() ===
                                        formData.category_id
                                )?.category_name || "Chọn một danh mục"}
                            </Text>
                        </View>
                        <ScrollView horizontal style={styles.categoryList}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.category_id}
                                    style={[
                                        styles.categoryChip,
                                        formData.category_id ===
                                            category.category_id.toString() &&
                                            styles.selectedCategoryChip,
                                    ]}
                                    onPress={() =>
                                        setFormData({
                                            ...formData,
                                            category_id:
                                                category.category_id.toString(),
                                        })
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            formData.category_id ===
                                                category.category_id.toString() &&
                                                styles.selectedCategoryChipText,
                                        ]}
                                    >
                                        {category.category_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Sizes, Colors, and Variants */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                            Kích thước màn hình (14 inch : 17, 17.3 inch : 17.3
                            ... phân cách bằng dấu phẩy)
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.sizes}
                            onChangeText={(text) =>
                                setFormData({ ...formData, sizes: text })
                            }
                            placeholder="13 inch, 15 inch"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                            Màu sắc (phân cách bằng dấu phẩy, dùng mã hex với #)
                        </Text>
                        <View style={styles.colorInputRow}>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    styles.colorTextInput,
                                ]}
                                value={formData.colors}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, colors: text })
                                }
                                placeholder="Nhấn nút bảng màu để chọn"
                                editable={true}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.colorPickerButton,
                                    { backgroundColor: Colors.primary },
                                ]}
                                onPress={() =>
                                    setIsWheelColorPickerVisible(true)
                                }
                            >
                                <MaterialIcons
                                    name="palette"
                                    size={20}
                                    color={Colors.whiteColor}
                                />
                            </TouchableOpacity>
                            {formData.colors && (
                                <TouchableOpacity
                                    style={styles.clearColorsButton}
                                    onPress={() =>
                                        setFormData({ ...formData, colors: "" })
                                    }
                                >
                                    <MaterialIcons
                                        name="clear"
                                        size={24}
                                        color={Colors.danger}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        {formData.colors && (
                            <View style={styles.colorPreviewContainer}>
                                {formData.colors
                                    .split(",")
                                    .map((color, index) => {
                                        const trimmedColor = color.trim();
                                        const isValidColor =
                                            /^#[0-9A-Fa-f]{6}$/.test(
                                                trimmedColor
                                            );
                                        return isValidColor ? (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.colorPreviewBox,
                                                    {
                                                        backgroundColor:
                                                            trimmedColor,
                                                    },
                                                ]}
                                            />
                                        ) : null;
                                    })}
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                            Phiên bản/Cấu hình (phân cách bằng dấu phẩy)
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.variants}
                            onChangeText={(text) =>
                                setFormData({ ...formData, variants: text })
                            }
                            placeholder="256GB, 512GB, 1TB"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Ghi chú</Text>
                        <TextInput
                            style={[styles.textInput, styles.multilineInput]}
                            value={formData.note}
                            onChangeText={(text) =>
                                setFormData({ ...formData, note: text })
                            }
                            placeholder="Special offer, Limited edition, etc."
                            multiline
                            numberOfLines={2}
                        />
                    </View>

                    {/* Images */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Hình ảnh sản phẩm</Text>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={showImagePickerOptions}
                        >
                            <Feather
                                name="image"
                                size={20}
                                color={Colors.primary}
                            />
                            <Text style={styles.imagePickerText}>
                                Chọn hình ảnh
                            </Text>
                        </TouchableOpacity>

                        {selectedImages.length > 0 && (
                            <ScrollView
                                horizontal
                                style={styles.imagePreviewContainer}
                            >
                                {selectedImages.map((image, index) => (
                                    <View
                                        key={index}
                                        style={styles.imagePreview}
                                    >
                                        <Image
                                            source={{ uri: image.uri }}
                                            style={styles.previewImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() =>
                                                setSelectedImages(
                                                    selectedImages.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                        >
                                            <Feather
                                                name="x"
                                                size={12}
                                                color={Colors.whiteColor}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Simple Color Picker */}
            <SimpleColorPicker
                visible={isColorPickerVisible}
                onClose={() => setIsColorPickerVisible(false)}
                onSelectColor={(color) => {
                    // Add color to the list if not already present
                    const currentColors = formData.colors
                        ? formData.colors.split(",").map((c) => c.trim())
                        : [];
                    if (!currentColors.includes(color)) {
                        const newColors = [...currentColors, color].join(", ");
                        setFormData({ ...formData, colors: newColors });
                    }
                    setIsColorPickerVisible(false);
                }}
            />

            {/* Wheel Color Picker */}
            <WheelColorPicker
                visible={isWheelColorPickerVisible}
                onClose={() => setIsWheelColorPickerVisible(false)}
                initialColors={formData.colors}
                onSelectColor={(colors) => {
                    setFormData({ ...formData, colors: colors });
                    setIsWheelColorPickerVisible(false);
                }}
            />
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color={Colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
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
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() =>
                    loading ? (
                        <ActivityIndicator
                            style={styles.loader}
                            size="large"
                            color={Colors.primary}
                        />
                    ) : null
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {/* Add Button */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={handleAddProduct}
            >
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
        flexDirection: "row",
        alignItems: "center",
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
        flexDirection: "row",
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
        justifyContent: "space-between",
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.blackColor,
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    newPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.primary,
        marginRight: 8,
    },
    oldPrice: {
        fontSize: 14,
        color: Colors.textSecondary,
        textDecorationLine: "line-through",
    },
    stockInfo: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    actionButtons: {
        justifyContent: "center",
        alignItems: "center",
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
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    closeButton: {
        padding: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.blackColor,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
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
        fontWeight: "500",
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
    colorInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    colorTextInput: {
        flex: 1,
        marginRight: 10,
    },
    colorPickerButton: {
        borderRadius: 8,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    clearColorsButton: {
        marginLeft: 10,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    colorPreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    colorPreviewBox: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: Colors.lightGray,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfWidth: {
        width: "48%",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: "dashed",
        borderRadius: 8,
    },
    imagePickerText: {
        marginLeft: 8,
        fontSize: 16,
        color: Colors.primary,
        fontWeight: "500",
    },
    imagePreviewContainer: {
        marginTop: 12,
    },
    imagePreview: {
        position: "relative",
        marginRight: 12,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: Colors.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    toggleContainer: {
        marginBottom: 20,
    },
    toggleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    multilineInput: {
        minHeight: 60,
        textAlignVertical: "top",
    },
});

export default ProductManagementScreen;
