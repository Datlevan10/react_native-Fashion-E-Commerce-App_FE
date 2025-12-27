import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { STORE_NAME_MAP } from "../../constants/storeName";
import Colors from "../../styles/Color";

const ProductInfoInDetail = ({
    storeName,
    averageReview,
    totalReview,
    productName,
    oldPrice,
    newPrice,
    productQuantity,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.brandText}>
                    {STORE_NAME_MAP[storeName]?.display || storeName}
                </Text>
                <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={15} color="#ffc32b" />
                    <Text style={styles.averageReviewText}>
                        {averageReview}
                    </Text>
                    <Text
                        style={styles.totalReviewText}
                    >{`(${totalReview})`}</Text>
                </View>
            </View>
            <Text style={styles.productName}>{productName}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.newPrice}>
                    {new Intl.NumberFormat("vi-VN").format(newPrice)} VND
                </Text>
                <Text style={styles.oldPrice}>
                    {new Intl.NumberFormat("vi-VN").format(oldPrice)} VND
                </Text>
            </View>
            <View style={styles.stockInfo}>
                {productQuantity > 0 ? (
                    <Text style={[styles.stockText, styles.inStock]}>
                        Còn {productQuantity} sản phẩm trong kho
                    </Text>
                ) : (
                    <View style={styles.outOfStockContainer}>
                        <MaterialIcons
                            name="error-outline"
                            size={20}
                            color={Colors.whiteBgColor}
                        />
                        <Text style={[styles.stockText, styles.outOfStock]}>
                            Đã hết hàng
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
    },
    categoryName: {
        color: "gray",
    },
    brandText: {
        fontSize: 18,
        color: "gray",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        // gap: 5
    },
    averageReviewText: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: "600",
        color: "black",
    },
    totalReviewText: {
        color: "gray",
        fontSize: 18,
    },
    productName: {
        // width: Dimensions.get("window").width * 0.5,
        fontSize: 24,
        marginVertical: 5,
        // textTransform: "uppercase",
        fontWeight: "600",
        color: "black",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    oldPrice: {
        fontSize: 18,
        textDecorationLine: "line-through",
        marginRight: 10,
        color: "gray",
    },
    newPrice: {
        fontSize: 24,
        fontWeight: "500",
        color: "#ed1b41",
    },
    stockInfo: {
        marginVertical: 5,
    },
    stockText: {
        fontSize: 16,
        fontWeight: "500",
    },
    inStock: {
        backgroundColor: "#69AE69",
        width: 200,
        borderRadius: 12,
        padding: 4,
        color: Colors.whiteColor
    },
    outOfStock: {
        color: Colors.whiteColor,
        fontSize: 16,
        marginLeft: 5,
    },
    outOfStockContainer: {
        flexDirection: "row",
        width: 120,
        borderRadius: 12,
        padding: 4,
        alignItems: "center",
        backgroundColor: "#DE7070",
    },
});

export default ProductInfoInDetail;
