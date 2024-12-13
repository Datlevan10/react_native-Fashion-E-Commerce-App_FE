import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Colors from "../styles/Color";

const WriteReviewModal = ({
  visible,
  onClose,
  onSubmit,
  productName,
  productImage,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleLength, setTitleLength] = useState(100);
  const [contentLength, setContentLength] = useState(2000);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleRating = (value) => {
    setRating(value);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!rating) newErrors.rating = "*Please fill out this field.";
    if (!title.trim()) newErrors.title = "*Please fill out this field.";
    if (!content.trim()) newErrors.content = "*Please fill out this field.";
    if (!userName.trim()) newErrors.userName = "*Please fill out this field.";
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

  const handleSubmit = () => {
    if (validateInputs()) {
      onSubmit({ rating, title, content, userName, email });
      setErrors({});
    }
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Rating & Review</Text>
          <View style={styles.productInfo}>
            <Image source={{ uri: productImage }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{productName}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name={star <= rating ? "star" : "star"}
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
                <Text style={styles.errorText}>{errors.rating}</Text>
              )}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Review Title </Text>
              <Text style={styles.charCount}>{titleLength}/100</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Example: Easy to use"
              placeholderTextColor="#a7abc3"
              maxLength={100}
              value={title}
              onChangeText={(text) =>
                setTitleLength(handleTextChange(setTitle, 100, text))
              }
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Product Review</Text>
              <Text style={styles.charCount}>{contentLength}/2000</Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Example: I have experienced this product. Product is made of good material and is very comfortable to wear."
              placeholderTextColor="#a7abc3"
              multiline
              maxLength={2000}
              value={content}
              onChangeText={(text) =>
                setContentLength(handleTextChange(setContent, 2000, text))
              }
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content}</Text>
            )}
          </View>
          <View style={styles.mediaRow}>
            <TouchableOpacity style={styles.mediaButton}>
              <View style={styles.iconBox}>
                <FontAwesome
                  name="camera"
                  size={18}
                  color={Colors.blackColor}
                />
              </View>
              <Text style={styles.mediaText}>Photo (5/5)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <View style={styles.iconBox}>
                <FontAwesome
                  name="video-camera"
                  size={18}
                  color={Colors.blackColor}
                />
              </View>
              <Text style={styles.mediaText}>Video (2/2)</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your name here"
              placeholderTextColor="#a7abc3"
              value={userName}
              onChangeText={setUserName}
            />
            {errors.userName && (
              <Text style={styles.errorText}>{errors.userName}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email is private and is used to send you discount"
              placeholderTextColor="#a7abc3"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  mediaRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
    gap: 10,
  },
  mediaButton: {
    flex: 0.25,
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
