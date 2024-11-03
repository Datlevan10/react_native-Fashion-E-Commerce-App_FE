import React, { useState } from "react";
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
  Platform
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import CustomTextInput from "../components/CustomTextInput";
import PasswordTextInput from "../components/PasswordTextInput";
import CustomHandleButton from "../components/CustomHandleButton";
import imageTest from "../assets/image/profile.png";
import Colors from "../themes/Color";

export default function ManagerProfileScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    console.log("Data save", {
      userName,
      fullName,
      email,
      phoneNumber,
      password,
      address,
    });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleGesture = (event) => {
    if (event.nativeEvent.translationY > 50) {
      toggleModal();
    }
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
          <Text style={styles.headerTitle}>Manage Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <Image source={imageTest} style={styles.avatar} />
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
        <PasswordTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new your password"
        />
        <CustomTextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter new your address"
          prefixIcon="location-on"
        />
        <CustomHandleButton
          buttonText="Save"
          buttonColor="#179e7a"
          onPress={handleSave}
        />
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
                onPress={() => alert("View picture")}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="visibility" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>View picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={() => alert("Change picture")}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="photo-camera" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Change picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={() => alert("Delete picture")}
              >
                <View style={styles.IconBox}>
                  <MaterialIcons name="delete" size={23} color="#333" />
                </View>
                <Text style={styles.modalOptionText}>Delete picture</Text>
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
