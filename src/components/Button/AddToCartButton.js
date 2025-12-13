import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Feather } from "react-native-vector-icons";

export default function AddToCartButton({
    iconName,
    title,
    backgroundColor,
    color,
    borderColor,
    onPress,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                },
            ]}
            onPress={onPress}
        >
            <View style={styles.content}>
                {iconName && (
                    <Feather
                        name={iconName}
                        size={20}
                        color={color}
                        style={styles.icon}
                    />
                )}
                <Text style={[styles.text, { color: color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        width: 170,
        borderWidth: 1,
        borderRadius: 24,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
