import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Feather } from "react-native-vector-icons";
import Colors from "../../styles/Color";

const FilterModal = ({
    visible,
    onClose,
    title,
    options,
    selectedValue,
    onSelect,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather
                                name="x"
                                size={24}
                                color={Colors.blackColor}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.optionsList}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                onSelect(null);
                                onClose();
                            }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedValue === null &&
                                        styles.selectedText,
                                ]}
                            >
                                All {title}
                            </Text>
                            {selectedValue === null && (
                                <Feather
                                    name="check"
                                    size={20}
                                    color={Colors.primary}
                                />
                            )}
                        </TouchableOpacity>

                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={
                                    typeof option.value === "object"
                                        ? `option-${index}`
                                        : option.value
                                }
                                style={styles.option}
                                onPress={() => {
                                    onSelect(option.value);
                                    onClose();
                                }}
                            >
                                {option.labelComponent ? (
                                    <View
                                        style={[
                                            (typeof option.value === "object"
                                                ? JSON.stringify(
                                                      selectedValue
                                                  ) ===
                                                  JSON.stringify(option.value)
                                                : selectedValue ===
                                                  option.value) && {
                                                opacity: 0.8,
                                            },
                                        ]}
                                    >
                                        {option.labelComponent}
                                    </View>
                                ) : (
                                    <Text
                                        style={[
                                            styles.optionText,
                                            (typeof option.value === "object"
                                                ? JSON.stringify(
                                                      selectedValue
                                                  ) ===
                                                  JSON.stringify(option.value)
                                                : selectedValue ===
                                                  option.value) &&
                                                styles.selectedText,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                )}
                                {(typeof option.value === "object"
                                    ? JSON.stringify(selectedValue) ===
                                      JSON.stringify(option.value)
                                    : selectedValue === option.value) && (
                                    <Feather
                                        name="check"
                                        size={20}
                                        color={Colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.blackColor,
    },
    optionsList: {
        padding: 20,
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrayColor,
    },
    optionText: {
        fontSize: 16,
        color: Colors.blackColor,
    },
    selectedText: {
        color: Colors.primary,
        fontWeight: "600",
    },
});

export default FilterModal;
