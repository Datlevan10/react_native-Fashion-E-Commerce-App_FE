import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import apiService from "../../api/ApiService";
import { FontAwesome, Feather } from "@expo/vector-icons";
import IconWithBadge from "../../components/Navbar/IconWithBadge";
import AddToCartButton from "../../components/Button/AddToCartButton";
import CustomButton from "../../components/Button/CustomButton";
import ColorSelector from "../../components/Product/ColorSelector";
import SizeSelector from "../../components/Product/SizeSelector";
import ProductInfoInDetail from "../../components/Product/ProductInfoInDetail";
import Colors from "../../styles/Color";
import ShowAlertWithTitleContentAndOneActions from "../../components/Alert/ShowAlertWithTitleContentAndOneActions ";
import ShowAlertWithTitleContentAndTwoActions from "../../components/Alert/ShowAlertWithTitleContentAndTwoActions ";
import NoReviewBox from "../../components/Review/NoReviewBox";
import ProductReviewWidget from "../../components/Review/ProductReviewWidget";
import WriteReviewModal from "../../components/Review/WriteReviewModal";
import ReviewSubmittedSuccessModal from "../../components/Review/ReviewSubmittedSuccessModal";
import WidgetLoading from "../../components/Review/WidgetLoading";
import TestimonialReviewWidget from "../../components/Review/TestimonialReviewWidget";

const { width, height } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
    const [storeName, setStoreName] = useState("");
    const [customerId, setCustomerId] = useState(null);
    const { product, images, colors, sizes } = route.params;

    // Sample variant data - replace with actual data from API or route params
    const productVariants = product.variant || [
        "Condition: 100% New",
        "CPU: Apple M3 Pro chip with 12-core CPU",
        "GPU: 18-core GPU, 16-core Neural Engine",
        "RAM: 18GB",
        "Storage: 512GB SSD",
        "Display: 16-inch Liquid Retina XDR display",
        "Interface: Three Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 ports",
        "Backlit Magic Keyboard with Touch ID – US English",
        "Weight: 2.14 kg",
    ];
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [reviewsTestimonial, setReviewsTestimonial] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isWriteReviewModalVisible, setWriteReviewModalVisible] =
        useState(false);
    const [
        isReviewSubmittedSuccessModalVisible,
        setReviewSubmittedSuccessModalVisible,
    ] = useState(false);
    const [submittedReviewData, setSubmittedReviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const fetchCustomerId = async () => {
            const customerId = await SecureStore.getItemAsync("customer_id");
            setCustomerId(customerId);
        };

        const fetchCartItemCount = async () => {
            try {
                const storedCustomerId = await SecureStore.getItemAsync(
                    "customer_id"
                );
                if (!storedCustomerId) {
                    setCartItemCount(0);
                    return;
                }

                const response =
                    await apiService.getProductInCartDetailByCustomerId(
                        storedCustomerId
                    );

                if (response.status === 200 && response.data?.data) {
                    const cartItems = response.data.data;
                    setCartItemCount(
                        Array.isArray(cartItems) ? cartItems.length : 0
                    );
                } else {
                    setCartItemCount(0);
                }
            } catch (error) {
                console.log("Error fetching cart count:", error);
                setCartItemCount(0);
            }
        };

        // Make fetchCartItemCount accessible outside useEffect
        window.refreshCartCount = fetchCartItemCount;

        const checkIfFavorite = async () => {
            const customerId = await SecureStore.getItemAsync("customer_id");
            if (!customerId) return;

            const response = await apiService.checkFavoriteProduct({
                customer_id: customerId,
                product_id: product.productId,
            });

            if (response.status === 200) {
                setIsFavorite(response.data.isFavorite);
            }
        };

        const getAllReviews = async () => {
            try {
                const response = await apiService.getAllReviews();

                if (response.status === 200) {
                    const fetchedReviews = response?.data?.data || [];

                    if (fetchedReviews.length > 0) {
                        setReviewsTestimonial(fetchedReviews);
                    } else {
                        // console.log("No reviews found.");
                        setReviewsTestimonial(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        const getReviewsByProductId = async () => {
            try {
                const response = await apiService.getReviewByProductId(
                    product.productId
                );

                if (response.status === 200) {
                    const fetchedReviews = response?.data?.data || [];

                    if (fetchedReviews.length > 0) {
                        setReviews(fetchedReviews);
                    } else {
                        setReviews(null);
                    }
                } else {
                    setReviews(null);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews(null);
            }
        };

        const fetchData = async () => {
            try {
                await Promise.allSettled([
                    fetchCustomerId(),
                    loadStoreName(),
                    getReviewsByProductId(),
                    getAllReviews(),
                    fetchCartItemCount(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            }
        };

        fetchData();

        // Set up interval to refresh cart count periodically
        const interval = setInterval(() => {
            fetchCartItemCount();
        }, 5000); // Refresh every 5 seconds

        // Focus listener to refresh cart when screen is focused
        const unsubscribe = navigation.addListener("focus", () => {
            fetchCartItemCount();
        });

        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, [navigation]);

    const reloadReviews = async () => {
        try {
            const response = await apiService.getReviewByProductId(
                product.productId
            );
            if (response.status === 200) {
                setReviews(response?.data?.data || []);
            } else {
                setReviews(null);
            }
        } catch (error) {
            console.error("Error reloading reviews:", error);
            setReviews(null);
        }
    };

    const handleAddToWishlist = async () => {
        try {
            const customerId = await SecureStore.getItemAsync("customer_id");
            if (!customerId) {
                console.warn("No customer ID found in SecureStore.");
                return;
            }

            const productData = {
                customer_id: customerId,
                product_id: product.productId,
            };

            const response = await apiService.addProductToFavorite(productData);
            if (response.status === 201) {
                setIsFavorite(true);
                Alert.alert("Success", "Product added to wishlist.");
            } else {
                Alert.alert(
                    "Error",
                    "Could not add product to wishlist. Try again."
                );
            }
        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setSelectedImageIndex(newIndex);
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

    const handleAddToCart = async (
        customerId,
        product,
        selectedColor,
        selectedSize
    ) => {
        if (!selectedSize) {
            Alert.alert("Lỗi", "Vui lòng chọn kích thước màn hình và thử lại");
            return;
        }

        if (!customerId) {
            Alert.alert("Error", "Please login to add products to cart.");
            return;
        }

        try {
            // Prepare data matching backend CartController requirements
            const cartItemData = {
                customer_id: customerId,
                product_id: product.productId,
                quantity: 1, // Default quantity is 1
                color: selectedColor,
                size: selectedSize,
            };

            const addResponse = await apiService.addToCart(cartItemData);

            if (addResponse.status === 201 || addResponse.status === 200) {
                Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng");
                // Refresh cart count after successfully adding item
                const fetchCartItemCount = async () => {
                    try {
                        const response =
                            await apiService.getProductInCartDetailByCustomerId(
                                customerId
                            );
                        if (response.status === 200 && response.data?.data) {
                            const cartItems = response.data.data;
                            setCartItemCount(
                                Array.isArray(cartItems) ? cartItems.length : 0
                            );
                        }
                    } catch (error) {
                        console.log("Error refreshing cart count:", error);
                    }
                };
                fetchCartItemCount();
            } else {
                Alert.alert(
                    "Error",
                    "Failed to add product to cart. Please try again."
                );
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "An unexpected error occurred. Please try again.";
            Alert.alert("Error", errorMessage);
        }
    };
    const mockReviews = [
        {
            review_id: "1",
            customer_name: "John Doe",
            review_product: "Great product!",
            stars_review: 5,
            review_date: "2025-01-16T12:00:00Z",
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.itemOne}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather
                            name="arrow-left"
                            size={22}
                            color={Colors.blackColor}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("CartScreen")}
                    >
                        <IconWithBadge
                            name="shopping-bag"
                            badgeCount={cartItemCount}
                            size={25}
                            color={Colors.blackColor}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.indicatorWrapper}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === selectedImageIndex
                                    ? styles.activeIndicator
                                    : {},
                            ]}
                        />
                    ))}
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.itemTwo}>
                    <View style={styles.infoIcon}>
                        <ProductInfoInDetail
                            storeName={storeName}
                            averageReview={product.averageReview.toString()}
                            totalReview={product.totalReview.toString()}
                            productName={product.productName}
                            oldPrice={product.oldPrice.toString()}
                            newPrice={product.newPrice.toString()}
                        />
                        <TouchableOpacity
                            onPress={() =>
                                ShowAlertWithTitleContentAndTwoActions(
                                    "Notification",
                                    "Add product to wishlist?",
                                    handleAddToWishlist,
                                    () =>
                                        console.log(
                                            "User cancelled adding product to wishlist"
                                        )
                                )
                            }
                        >
                            <FontAwesome
                                name={isFavorite ? "heart" : "heart-o"}
                                size={22}
                                color={
                                    isFavorite ? "#ff0034" : Colors.blackColor
                                }
                            />
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={styles.productDescription}>{product.description}</Text> */}
                    <View>
                        <Text
                            style={styles.productDescription}
                            numberOfLines={isExpanded ? undefined : 4}
                        >
                            {isExpanded
                                ? product.description
                                : product.description.slice(0, 180)}
                            {!isExpanded &&
                                product.description.length > 100 && (
                                    <Text
                                        style={styles.toggleText}
                                        onPress={() => setIsExpanded(true)}
                                    >
                                        ...Xem thêm
                                    </Text>
                                )}
                        </Text>
                        {isExpanded && (
                            <TouchableOpacity
                                onPress={() => setIsExpanded(false)}
                            >
                                <Text style={styles.toggleText}>Thu gọn</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.selectionRow}>
                        <View style={styles.column}>
                            <ColorSelector
                                colors={colors}
                                onColorSelect={(color) =>
                                    setSelectedColor(color)
                                }
                            />
                        </View>
                        <View style={styles.column}>
                            <SizeSelector
                                sizes={sizes}
                                onSizeSelect={(size) => setSelectedSize(size)}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <AddToCartButton
                            iconName="shopping-bag"
                            title="THÊM VÀO GIỎ"
                            backgroundColor={Colors.whiteColor}
                            color={Colors.blackColor}
                            borderColor={Colors.blackColor}
                            onPress={() =>
                                handleAddToCart(
                                    customerId,
                                    product,
                                    selectedColor,
                                    selectedSize
                                )
                            }
                        />
                        <CustomButton
                            title="MUA NGAY"
                            backgroundColor={Colors.blackColor}
                            onPress={() => {
                                if (!selectedColor || !selectedSize) {
                                    Alert.alert(
                                        "Error",
                                        "Please select color and size first"
                                    );
                                    return;
                                }

                                // Navigate to OrderScreen with product data
                                const orderItem = {
                                    product_id: product.productId,
                                    product_name: product.productName,
                                    image_url: images[0],
                                    new_price: product.newPrice,
                                    quantity: 1,
                                    color: selectedColor,
                                    size: selectedSize,
                                };

                                navigation.navigate("OrderScreen", {
                                    cartItems: [orderItem],
                                    cartId: null, // Direct buy, no cart needed
                                });
                            }}
                        />
                    </View>
                    <View style={styles.variantWrap}>
                        <Text style={styles.productVariant}>
                            Thông số kỹ thuật
                        </Text>
                        {productVariants && productVariants.length > 0 && (
                            <View style={styles.variantContainer}>
                                {productVariants.map((variant, index) => {
                                    const [label, value] = variant.includes(":")
                                        ? variant.split(": ")
                                        : ["", variant];
                                    return (
                                        <View
                                            key={index}
                                            style={styles.variantItem}
                                        >
                                            {label ? (
                                                <>
                                                    <Text
                                                        style={
                                                            styles.variantLabel
                                                        }
                                                    >
                                                        {label}:
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.variantValue
                                                        }
                                                    >
                                                        {value}
                                                    </Text>
                                                </>
                                            ) : (
                                                <Text
                                                    style={styles.variantValue}
                                                >
                                                    • {value}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                    <View style={styles.reviewContainer}>
                        {isLoading ? (
                            // <ActivityIndicator />
                            <WidgetLoading />
                        ) : (
                            <TestimonialReviewWidget
                                reviews={reviewsTestimonial}
                            />
                        )}
                    </View>
                    <View style={styles.reviewContainer}>
                        {isLoading ? (
                            // <ActivityIndicator />
                            <WidgetLoading />
                        ) : reviews === null ? (
                            <NoReviewBox
                                title="Customer Reviews"
                                subtitle="No review yet. Any feedback? Let us know"
                                buttonText="Write Review"
                                onWriteReview={() =>
                                    setWriteReviewModalVisible(true)
                                }
                            />
                        ) : (
                            <ProductReviewWidget
                                reviews={reviews}
                                onWriteReview={() =>
                                    setWriteReviewModalVisible(true)
                                }
                            />
                        )}
                        {isWriteReviewModalVisible &&
                            !isReviewSubmittedSuccessModalVisible && (
                                <WriteReviewModal
                                    visible={isWriteReviewModalVisible}
                                    onClose={() =>
                                        setWriteReviewModalVisible(false)
                                    }
                                    customerId={customerId}
                                    productId={product.productId}
                                    productName={product.productName}
                                    productImage={images[selectedImageIndex]}
                                    onSubmit={(data) => {
                                        setSubmittedReviewData(data);
                                        setWriteReviewModalVisible(false);
                                        setReviewSubmittedSuccessModalVisible(
                                            true
                                        );
                                    }}
                                />
                            )}
                        {isReviewSubmittedSuccessModalVisible &&
                            submittedReviewData && (
                                <ReviewSubmittedSuccessModal
                                    visible={
                                        isReviewSubmittedSuccessModalVisible
                                    }
                                    onClose={() => {
                                        setReviewSubmittedSuccessModalVisible(
                                            false
                                        );
                                        setIsLoading(true);
                                        reloadReviews().finally(() =>
                                            setIsLoading(false)
                                        );
                                    }}
                                    {...submittedReviewData}
                                />
                            )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayBgColor,
        paddingTop: 10,
    },
    itemOne: {
        height: height / 2,
        backgroundColor: Colors.grayBgColor,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    imageContainer: {
        width: width,
        height: height / 2,
        backgroundColor: Colors.grayBgColor,
        justifyContent: "center",
        alignItems: "center",
    },
    productImage: {
        width: "80%",
        height: "80%",
    },
    header: {
        position: "absolute",
        top: 38,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
    },
    headerTitle: {
        fontSize: 22,
        color: Colors.blackColor,
        fontWeight: "600",
    },
    indicatorWrapper: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.indicatorDefaultColor,
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: Colors.indicatorActiveColor,
    },
    itemTwo: {
        // height: height / 2,
        backgroundColor: Colors.whiteBgColor,
        padding: 18,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    infoIcon: {
        flexDirection: "row",
        paddingRight: 20,
    },
    productDescription: {
        fontSize: 18,
        color: Colors.textDescription,
        marginTop: 20,
        marginBottom: 20,
        lineHeight: 25,
        textAlign: "justify",
    },
    variantWrap: {
        marginTop: 30,
    },
    productVariant: {
        fontSize: 16,
        fontWeight: "bold",
    },
    variantContainer: {
        marginTop: 8,
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
    variantItem: {
        flexDirection: "row",
        marginBottom: 8,
        flexWrap: "wrap",
    },
    variantLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.blackColor,
        marginRight: 5,
    },
    variantValue: {
        fontSize: 16,
        color: Colors.darkGray,
        flex: 1,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.textDescription,
        textDecorationLine: "none",
        alignSelf: "flex-start",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    selectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        gap: 30,
    },
    reviewContainer: {
        marginTop: 35,
    },
    reviewContainerTitle: {
        fontSize: 18,
    },
});
