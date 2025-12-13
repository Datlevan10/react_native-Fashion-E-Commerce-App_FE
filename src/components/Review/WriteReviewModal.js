import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import Modal from "react-native-modal";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import Colors from "../../styles/Color";
import ApiService from "../../api/ApiService";
import * as FileSystem from "expo-file-system";

const WriteReviewModal = ({
    visible,
    onClose,
    onSubmit,
    customerId,
    productId,
    productName,
    productImage,
}) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [titleLength, setTitleLength] = useState(100);
    const [contentLength, setContentLength] = useState(2000);
    const [media, setMedia] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleMediaUpload = async (type) => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(
                "Permission required",
                "Permission to access media library is required."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                type === "photo"
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedMedia = result.assets.map((item) => ({
                uri: item.uri,
                type: item.type === "image" ? "image/jpeg" : "video/mp4",
                name:
                    item.uri.split("/").pop() ||
                    `media.${item.type === "image" ? "jpg" : "mp4"}`,
            }));

            console.log("Selected media:", selectedMedia);

            if (media.length + selectedMedia.length > 5) {
                Alert.alert("Error", "You can only upload up to 5 files.");
            } else {
                setMedia([...media, ...selectedMedia]);
            }
        }
    };

    const handleRemoveMedia = (index) => {
        setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    };

    const handleRating = (value) => {
        setRating(value);
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!rating) newErrors.rating = "*Please fill out this field.";
        if (!title.trim()) newErrors.title = "*Please fill out this field.";
        if (!content.trim()) newErrors.content = "*Please fill out this field.";
        if (!customerName.trim())
            newErrors.customerName = "*Please fill out this field.";
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = email.trim()
                ? "*Invalid email format."
                : "*Please fill out this field.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTextChange = (setter, maxLength, value) => {
        setter(value);
        return maxLength - value.length;
    };

    const handleReviewSubmit = async () => {
        if (!validateInputs()) {
            return;
        }

        const formData = new FormData();
        formData.append("customer_id", customerId);
        formData.append("product_id", productId);
        formData.append("review_title", title);
        formData.append("review_product", content);
        formData.append("stars_review", rating);
        formData.append("customer_name", customerName);
        formData.append("customer_email", email);

        media.forEach((file, index) => {
            formData.append(`media[${index}]`, file);
        });

        try {
            const response = await ApiService.writeReviewProduct(formData);
            if (response.status === 201) {
                const submittedData = {
                    productName,
                    productImage,
                    stars: rating,
                    title,
                    content,
                    media,
                    // media: media.map((file) => ({ uri: file.uri })),
                    customerName,
                    customerEmail: email,
                };
                onSubmit(submittedData);
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            alert(
                "An error occurred while submitting the review. Please check your connection and try again."
            );
        }
    };

    return (
        <Modal
            isVisible={visible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver={true}
            onBackdropPress={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <AntDesign
                                name="close"
                                size={24}
                                color={Colors.blackColor}
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Đánh giá sản phẩm</Text>
                        <View style={styles.productInfo}>
                            <Image
                                source={{ uri: productImage }}
                                style={styles.productImage}
                            />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>
                                    {productName}
                                </Text>
                                <View style={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesome
                                            key={star}
                                            name={
                                                star <= rating ? "star" : "star"
                                            }
                                            size={30}
                                            color={
                                                star <= rating
                                                    ? Colors.yellowColor
                                                    : Colors.defaultStarColor
                                            }
                                            onPress={() => handleRating(star)}
                                        />
                                    ))}
                                </View>
                                {errors.rating && (
                                    <Text style={styles.errorText}>
                                        {errors.rating}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>
                                    Tiêu đề bài đánh giá
                                </Text>
                                <Text style={styles.charCount}>
                                    {titleLength}/100
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Ví dụ: Dễ sử dụng"
                                placeholderTextColor="#a7abc3"
                                maxLength={100}
                                value={title}
                                onChangeText={(text) =>
                                    setTitleLength(
                                        handleTextChange(setTitle, 100, text)
                                    )
                                }
                            />
                            {errors.title && (
                                <Text style={styles.errorText}>
                                    {errors.title}
                                </Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>
                                    Đánh giá sản phẩm
                                </Text>
                                <Text style={styles.charCount}>
                                    {contentLength}/2000
                                </Text>
                            </View>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Ví dụ: Tôi đã trải nghiệm sản phẩm này. Sản phẩm được làm từ chất liệu tốt và rất thoải mái khi đeo."
                                placeholderTextColor="#a7abc3"
                                multiline
                                maxLength={2000}
                                value={content}
                                onChangeText={(text) =>
                                    setContentLength(
                                        handleTextChange(setContent, 2000, text)
                                    )
                                }
                            />
                            {errors.content && (
                                <Text style={styles.errorText}>
                                    {errors.content}
                                </Text>
                            )}
                        </View>
                        <ScrollView
                            horizontal
                            style={styles.mediaPreviewRow}
                            contentContainerStyle={{ alignItems: "center" }}
                        >
                            {media.map((file, index) => (
                                <View key={index} style={styles.mediaBox}>
                                    {file.type === "image/jpeg" ? (
                                        <Image
                                            source={{ uri: file.uri }}
                                            style={styles.mediaImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Video
                                            source={{ uri: file.uri }}
                                            style={styles.mediaImage}
                                            resizeMode="cover"
                                            shouldPlay
                                            isLooping
                                        />
                                    )}
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleRemoveMedia(index)}
                                    >
                                        <AntDesign
                                            name="close"
                                            size={14}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <View style={styles.mediaRow}>
                                <TouchableOpacity
                                    style={styles.mediaButton}
                                    onPress={() => handleMediaUpload("photo")}
                                >
                                    <View style={styles.iconBox}>
                                        <FontAwesome
                                            name="camera"
                                            size={18}
                                            color={Colors.blackColor}
                                        />
                                    </View>
                                    <Text style={styles.mediaText}>
                                        Ảnh (5/5)
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.mediaButton}
                                    onPress={() => handleMediaUpload("video")}
                                >
                                    <View style={styles.iconBox}>
                                        <FontAwesome
                                            name="video-camera"
                                            size={18}
                                            color={Colors.blackColor}
                                        />
                                    </View>
                                    <Text style={styles.mediaText}>
                                        Video (2/2)
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tên khách hàng</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nhập tên của bạn vào đây"
                                placeholderTextColor="#a7abc3"
                                value={customerName}
                                onChangeText={setCustomerName}
                            />
                            {errors.customerName && (
                                <Text style={styles.errorText}>
                                    {errors.customerName}
                                </Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email khách hàng</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Địa chỉ email của bạn là riêng tư và chỉ được sử dụng để gửi cho bạn mã giảm giá."
                                placeholderTextColor="#a7abc3"
                                value={email}
                                onChangeText={setEmail}
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleReviewSubmit}
                        >
                            <Text style={styles.submitText}>Gửi đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default WriteReviewModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "100%",
        backgroundColor: Colors.whiteBgColor,
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    productInfo: {
        flexDirection: "row",
        marginBottom: 15,
    },
    productImage: {
        width: 78,
        height: 78,
        marginRight: 16,
        borderRadius: 5,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    stars: {
        flexDirection: "row",
        marginTop: 10,
        gap: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    charCount: {
        fontSize: 14,
        color: Colors.blackColor,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.HMborderColor,
        borderRadius: 5,
        padding: 10,
    },
    textArea: {
        borderWidth: 1,
        borderColor: Colors.HMborderColor,
        borderRadius: 5,
        padding: 10,
        height: 100,
        textAlignVertical: "top",
    },
    mediaPreviewRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    mediaBox: {
        width: 80,
        height: 80,
        marginRight: 10,
        position: "relative",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        overflow: "hidden",
    },
    mediaImage: {
        width: "100%",
        height: "100%",
    },
    deleteButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 5,
        padding: 3,
    },
    mediaRow: {
        flexDirection: "row",
        justifyContent: "flex-start",

        gap: 10,
    },
    mediaButton: {
        flex: 0.2,
        borderWidth: 1,
        borderColor: Colors.HMborderColor,
        borderRadius: 5,
        alignItems: "center",
        padding: 10,
        borderStyle: "dashed",
    },
    iconBox: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: Colors.defaultStarColor,
    },
    mediaText: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.gray,
    },
    submitButton: {
        width: 150,
        alignSelf: "center",
        backgroundColor: Colors.blackColor,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    submitText: {
        fontSize: 16,
        color: Colors.whiteBgColor,
        fontWeight: "500",
    },
    closeText: {
        color: Colors.gray,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginTop: 5,
    },
});
