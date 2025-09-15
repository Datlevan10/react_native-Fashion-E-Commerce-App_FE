import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import imageTest from "../../../assets/image/profile.png";
import Colors from "../../styles/Color";
import ApiService from "../../api/ApiService";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from 'expo-image-picker';

export default function ManagerProfileScreen({ navigation }) {
  const [customer, setCustomer] = useState(null);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const customerId = await SecureStore.getItemAsync("customer_id");
      if (customerId) {
        const response = await ApiService.getInfoCustomerByCustomerId(customerId);
        const customerData = response.data.data;
        
        setCustomer(customerData);
        setUserName(customerData.user_name || "");
        setFullName(customerData.full_name || "");
        setEmail(customerData.email || "");
        setPhoneNumber(customerData.phone_number || "");
        setAddress(customerData.address || "");
        setGender(customerData.gender || "");
        setDateOfBirth(customerData.date_of_birth || "");
        setImageUri(customerData.image || null);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      Alert.alert("Error", "Failed to load customer data");
    }
  };

  const handleSave = async () => {
    if (!customer) return;
    
    setLoading(true);
    try {
      // Check if image is being updated
      const hasImageUpdate = imageUri && imageUri !== customer.image;
      
      let requestData;
      let hasImages = false;
      
      if (hasImageUpdate) {
        // Use FormData when uploading image
        const formData = new FormData();
        hasImages = true;
        
        // Only append fields that have been changed
        if (userName !== customer.user_name) formData.append('user_name', userName);
        if (fullName !== customer.full_name) formData.append('full_name', fullName);
        if (email !== customer.email) formData.append('email', email);
        if (phoneNumber !== customer.phone_number) formData.append('phone_number', phoneNumber);
        if (address !== customer.address) formData.append('address', address);
        if (gender !== customer.gender) formData.append('gender', gender);
        if (dateOfBirth !== customer.date_of_birth) formData.append('date_of_birth', dateOfBirth);
        
        // Handle image upload
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: imageUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        });
        
        requestData = formData;
      } else {
        // Use JSON when no image upload
        requestData = {};
        hasImages = false;
        
        // Only include fields that have been changed
        if (userName !== customer.user_name) requestData.user_name = userName;
        if (fullName !== customer.full_name) requestData.full_name = fullName;
        if (email !== customer.email) requestData.email = email;
        if (phoneNumber !== customer.phone_number) requestData.phone_number = phoneNumber;
        if (address !== customer.address) requestData.address = address;
        if (gender !== customer.gender) requestData.gender = gender;
        if (dateOfBirth !== customer.date_of_birth) requestData.date_of_birth = dateOfBirth;
      }

      const response = await ApiService.updateCustomer(customer.customer_id, requestData, hasImages);
      
      if (response.data) {
        Alert.alert(
          "Success",
          "Profile updated successfully",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleGesture = (event) => {
    if (event.nativeEvent.translationY > 50) {
      toggleModal();
    }
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      toggleModal();
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take a photo!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      toggleModal();
    }
  };

  const deleteImage = () => {
    setImageUri(null);
    toggleModal();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.body}
    >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý hồ sơ</Text>
          <View style={styles.placeholder} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            source={imageUri ? { uri: imageUri } : imageTest} 
            style={styles.avatar} 
          />
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={toggleModal}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <CustomTextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter new your username"
          prefixIcon="person"
        />
        <CustomTextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter new your full name"
          prefixIcon="account-circle"
        />
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter new your email"
          prefixIcon="email"
          keyboardType="email-address"
        />
        <CustomTextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter new your phone number"
          prefixIcon="phone"
          keyboardType="phone-pad"
        />
        <CustomTextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter new your address"
          prefixIcon="location-on"
        />
        <CustomHandleButton
          buttonText={loading ? "Saving..." : "Save"}
          buttonColor="#179e7a"
          onPress={handleSave}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator 
            size="large" 
            color="#179e7a" 
            style={{ marginTop: 20 }}
          />
        )}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal} />
          <PanGestureHandler onGestureEvent={handleGesture}>
            <View style={styles.modalContent}>
              <View style={styles.dragHandle} />
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={() => {
                  if (imageUri) {
                    Alert.alert("Current Image", imageUri);
                  } else {
                    Alert.alert("No Image", "No custom image set");
                  }
                }}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="visibility" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Xem hình ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={pickImage}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="photo-library" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Chọn từ thư viện</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={takePhoto}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="photo-camera" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Chụp ảnh mới</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={deleteImage}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="delete" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Xóa hình ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={toggleModal}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="cancel" size={23} color="#333" />
                </View>
                <Text style={[styles.modalOptionText, { color: "red" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </PanGestureHandler>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 25,
    color: Colors.blackColor,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    padding: 18,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#179e7a",
    borderRadius: 20,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    paddingBottom: 30,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginBottom: 15,
  },
  modalOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  IconBox: {
    width: 38,
    height: 38,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  modalOptionText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
});