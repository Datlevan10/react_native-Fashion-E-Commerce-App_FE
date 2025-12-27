import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import ProductCard from "../../components/Product/ProductCard";
import CategoryForm from "../../components/Category/CategoryForm";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

export default function HomeContentScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [imageEventSource, setImageEventSource] = useState(null);
    const [storeName, setStoreName] = useState("");
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                loadCategories(),
                loadEventImage(),
                loadFeatureProducts(),
                loadStoreName(),
            ]);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
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

    const loadEventImage = async () => {
        try {
            const response = await apiService.getEventImageActive();
            if (
                response &&
                response.data.data &&
                response.data.data[0] &&
                response.data.data[0].event_image.length > 0
            ) {
                setImageEventSource({
                    uri: `${API_BASE_URL}${response.data.data[0].event_image[0]}`,
                });
            }
        } catch (error) {
            console.error("Failed to load event image:", error);
        }
    };

    const loadFeatureProducts = async () => {
        try {
            // Xu ly lai cho nay dang truyen truc tiep category5
            const response = await apiService.getFeatureProducts("OZhqLzLo");
            // console.log("API Response:", response);
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
                    imageArr: item.image.map(
                        (img) => `${API_BASE_URL}${img.url}`
                    ),
                    categoryName: item.category_name,
                    averageReview: item.average_review,
                    totalReview: item.total_review,
                    productName: item.product_name,
                    description: item.description,
                    oldPrice: item.old_price,
                    newPrice: item.new_price,
                    colorArr: item.color.map((color) =>
                        typeof color === "string"
                            ? color
                            : `${color.color_code}`
                    ),
                    sizeArr: item.size.map((size) =>
                        typeof size === "string" ? size : `${size.size}`
                    ),
                    variant: item.variant || [],
                    quantityInStock: item.quantity_in_stock || 0,
                }))
            );
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    };

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

    const handleCategoryPress = (categoryId) => {
        navigation.navigate("CategoryProductsScreen", {
            categoryId,
            categoryName: categories.find(
                (cat) => cat.categoryId === categoryId
            )?.categoryName,
        });
    };

    const handleSeeAllCategories = () => {
        navigation.navigate("Explore");
    };

    const handleSeeAllProducts = () => {
        navigation.navigate("Explore");
    };

    useEffect(() => {
        // load data
        loadCategories();
        loadEventImage();
        loadFeatureProducts();
        loadStoreName();
    }, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.container}
        >
            <View style={styles.container}>
                {imageEventSource ? (
                    <Image
                        source={imageEventSource}
                        style={styles.imageEvent}
                    />
                ) : (
                    <Text style={styles.loadingText}>
                        Loading image Event...
                    </Text>
                )}
                <View style={styles.itemBar}>
                    <Text style={styles.titleText}>Danh mục sản phẩm</Text>
                    <TouchableOpacity onPress={handleSeeAllCategories}>
                        <Text style={styles.moreText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                >
                    <CategoryForm
                        categories={categories}
                        containerStyle={styles.customContainer}
                        onCategoryPress={handleCategoryPress}
                    />
                </ScrollView>
                <View style={styles.itemBar}>
                    <Text style={styles.titleText}>Đề xuất cho bạn</Text>
                    <TouchableOpacity onPress={handleSeeAllProducts}>
                        <Text style={styles.moreText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featureProductList}
                >
                    {products.map((product) => (
                        <ProductCard
                            key={product.productId}
                            imageSource={product.productImage}
                            storeName={storeName}
                            categoryName={product.categoryName}
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
                                    quantityInStock: product.quantityInStock,
                                })
                            }
                            cardWidth={Dimensions.get("window").width * 0.5}
                            imageWidth={"90%"}
                            imageHeight={"90%"}
                        />
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteBgColor,
    },
    imageEvent: {
        height: 170,
        width: 400,
    },
    itemBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingVertical: 13,
        paddingHorizontal: 18,
        marginTop: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "500",
        color: Colors.blackColor,
    },
    moreText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    categoryList: {
        paddingHorizontal: 18,
    },
    featureProductList: {
        paddingHorizontal: 18,
        gap: 18,
    },
});
