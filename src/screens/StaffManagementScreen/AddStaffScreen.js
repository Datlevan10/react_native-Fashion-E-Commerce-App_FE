import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import PasswordTextInput from "../../components/TextField/PasswordTextInput";
import CustomButton from "../../components/Button/CustomButton";

const AddStaffScreen = ({ navigation }) => {
  const [staffData, setStaffData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    address: "",
    role: "staff",
    department: "",
    salary: "",
    status: "active",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    { label: "Staff", value: "staff" },
    { label: "Manager", value: "manager" },
    { label: "Admin", value: "admin" },
    { label: "Cashier", value: "cashier" },
  ];

  const departments = [
    "Sales",
    "Marketing",
    "IT",
    "HR",
    "Finance",
    "Operations",
    "Customer Service",
  ];

  const handleInputChange = (field, value) => {
    setStaffData({ ...staffData, [field]: value });
  };

  const validateForm = () => {
    const required = ["full_name", "email", "password", "role", "department"];
    for (let field of required) {
      if (!staffData[field].trim()) {
        Alert.alert("Validation Error", `Please fill in ${field.replace("_", " ")}`);
        return false;
      }
    }

    if (staffData.password !== staffData.confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }

    if (staffData.password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staffData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleAddStaff = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(staffData).forEach((key) => {
        if (key !== "confirmPassword") {
          formData.append(key, staffData[key]);
        }
      });

      if (avatar) {
        formData.append("avatar", {
          uri: avatar.uri,
          type: avatar.type || "image/jpeg",
          name: avatar.name || "avatar.jpg",
        });
      }

      const response = await apiService.createStaff(formData);
      
      if (response.data.success) {
        Alert.alert(
          "Success",
          "Staff member added successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add staff member"
      );
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const renderRolePicker = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Role *</Text>
      <View style={styles.pickerContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.pickerOption,
              staffData.role === role.value && styles.selectedOption,
            ]}
            onPress={() => handleInputChange("role", role.value)}
          >
            <Text
              style={[
                styles.pickerText,
                staffData.role === role.value && styles.selectedText,
              ]}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDepartmentPicker = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Department *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalPicker}
      >
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept}
            style={[
              styles.departmentOption,
              staffData.department === dept && styles.selectedOption,
            ]}
            onPress={() => handleInputChange("department", dept)}
          >
            <Text
              style={[
                styles.pickerText,
                staffData.department === dept && styles.selectedText,
              ]}
            >
              {dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a73e8", "#e3f2fd"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Staff Member</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                {avatar ? (
                  <Image source={{ uri: avatar.uri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="camera" size={24} color={Colors.textSecondary} />
                    <Text style={styles.avatarText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <CustomTextInput
                placeholder="Full Name *"
                value={staffData.full_name}
                onChangeText={(text) => handleInputChange("full_name", text)}
                style={styles.input}
              />

              <CustomTextInput
                placeholder="Email Address *"
                value={staffData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <CustomTextInput
                placeholder="Phone Number"
                value={staffData.phone_number}
                onChangeText={(text) => handleInputChange("phone_number", text)}
                keyboardType="phone-pad"
                style={styles.input}
              />

              <CustomTextInput
                placeholder="Address"
                value={staffData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </View>

            {/* Account Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              
              <PasswordTextInput
                placeholder="Password *"
                value={staffData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                style={styles.input}
              />

              <PasswordTextInput
                placeholder="Confirm Password *"
                value={staffData.confirmPassword}
                onChangeText={(text) => handleInputChange("confirmPassword", text)}
                style={styles.input}
              />
            </View>

            {/* Work Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Information</Text>
              
              {renderRolePicker()}
              {renderDepartmentPicker()}

              <CustomTextInput
                placeholder="Monthly Salary (USD)"
                value={staffData.salary}
                onChangeText={(text) => handleInputChange("salary", text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <CustomButton
              title={loading ? "Adding Staff..." : "Add Staff Member"}
              onPress={handleAddStaff}
              disabled={loading}
              style={styles.addButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.whiteColor,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.grayBgColor,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  pickerText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  selectedText: {
    color: Colors.whiteColor,
    fontWeight: "500",
  },
  horizontalPicker: {
    flexDirection: "row",
  },
  departmentOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.grayBgColor,
    marginRight: 10,
  },
  addButton: {
    marginTop: 20,
  },
});

export default AddStaffScreen;