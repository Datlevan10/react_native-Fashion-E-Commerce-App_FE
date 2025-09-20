import React, { useState } from "react";
import { 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import Colors from "../../styles/Color";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import apiService from "../../api/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    // Regex to validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    console.log('=== Bắt đầu quá trình đổi mật khẩu ===');
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        "Lỗi", 
        "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)"
      );
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không được giống mật khẩu cũ");
      return;
    }

    try {
      setLoading(true);
      
      // Get customer ID from AsyncStorage or SecureStore
      console.log('Tìm kiếm thông tin khách hàng...');
      let customerId = null;
      
      // Try to get from SecureStore first
      const secureCustomerId = await SecureStore.getItemAsync('customer_id');
      if (secureCustomerId) {
        customerId = secureCustomerId;
        console.log('Tìm thấy customer_id từ SecureStore:', customerId);
      } else {
        // Try AsyncStorage
        const customerInfo = await AsyncStorage.getItem('customerInfo');
        if (customerInfo) {
          const customer = JSON.parse(customerInfo);
          customerId = customer.customer_id || customer.id;
          console.log('Tìm thấy customer_id từ AsyncStorage:', customerId);
        }
      }
      
      if (!customerId) {
        console.error('Không tìm thấy customer_id');
        Alert.alert("Lỗi", "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại");
        navigation.navigate('LoginScreen');
        return;
      }

      // Log request data
      console.log('Gửi yêu cầu đổi mật khẩu với:', {
        customer_id: customerId,
        old_password: '***',
        new_password: '***'
      });

      // Call API to update password
      const response = await apiService.updateCustomerPassword(
        customerId,
        oldPassword,
        newPassword
      );
      
      console.log('Phản hồi API:', {
        status: response.status,
        data: response.data
      });

      if (response.data.message === 'Password updated successfully') {
        console.log('Đổi mật khẩu thành công!');
        Alert.alert(
          "Thành công",
          "Đổi mật khẩu thành công. Vui lòng đăng nhập lại",
          [
            {
              text: "OK",
              onPress: async () => {
                // Clear stored data and navigate to login
                console.log('Xóa dữ liệu lưu trữ và chuyển đến màn hình đăng nhập');
                await AsyncStorage.removeItem('customerInfo');
                await AsyncStorage.removeItem('authToken');
                await SecureStore.deleteItemAsync('customer_id');
                await SecureStore.deleteItemAsync('access_token');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginScreen' }],
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.error_code === 'OLD_PASSWORD_INVALID') {
        Alert.alert("Lỗi", "Mật khẩu cũ không đúng");
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        Alert.alert("Lỗi", errorMessages);
      } else {
        Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
      console.log('=== Kết thúc quá trình đổi mật khẩu ===');
    }
  };

  const PasswordRequirements = () => (
    <View style={styles.requirementsContainer}>
      <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu mới:</Text>
      <View style={styles.requirementRow}>
        <Feather 
          name={newPassword.length >= 8 ? "check-circle" : "circle"} 
          size={16} 
          color={newPassword.length >= 8 ? Colors.success : Colors.textSecondary} 
        />
        <Text style={[
          styles.requirementText,
          { color: newPassword.length >= 8 ? Colors.success : Colors.textSecondary }
        ]}>
          Ít nhất 8 ký tự
        </Text>
      </View>
      <View style={styles.requirementRow}>
        <Feather 
          name={/[A-Z]/.test(newPassword) ? "check-circle" : "circle"} 
          size={16} 
          color={/[A-Z]/.test(newPassword) ? Colors.success : Colors.textSecondary} 
        />
        <Text style={[
          styles.requirementText,
          { color: /[A-Z]/.test(newPassword) ? Colors.success : Colors.textSecondary }
        ]}>
          Ít nhất 1 chữ hoa
        </Text>
      </View>
      <View style={styles.requirementRow}>
        <Feather 
          name={/[a-z]/.test(newPassword) ? "check-circle" : "circle"} 
          size={16} 
          color={/[a-z]/.test(newPassword) ? Colors.success : Colors.textSecondary} 
        />
        <Text style={[
          styles.requirementText,
          { color: /[a-z]/.test(newPassword) ? Colors.success : Colors.textSecondary }
        ]}>
          Ít nhất 1 chữ thường
        </Text>
      </View>
      <View style={styles.requirementRow}>
        <Feather 
          name={/\d/.test(newPassword) ? "check-circle" : "circle"} 
          size={16} 
          color={/\d/.test(newPassword) ? Colors.success : Colors.textSecondary} 
        />
        <Text style={[
          styles.requirementText,
          { color: /\d/.test(newPassword) ? Colors.success : Colors.textSecondary }
        ]}>
          Ít nhất 1 số
        </Text>
      </View>
      <View style={styles.requirementRow}>
        <Feather 
          name={/[@$!%*?&]/.test(newPassword) ? "check-circle" : "circle"} 
          size={16} 
          color={/[@$!%*?&]/.test(newPassword) ? Colors.success : Colors.textSecondary} 
        />
        <Text style={[
          styles.requirementText,
          { color: /[@$!%*?&]/.test(newPassword) ? Colors.success : Colors.textSecondary }
        ]}>
          Ít nhất 1 ký tự đặc biệt (@$!%*?&)
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Thay đổi mật khẩu</Text>
          <Text style={styles.subTitle}>
            Để bảo mật tài khoản, vui lòng nhập mật khẩu cũ và mật khẩu mới
          </Text>

          <View style={styles.inputContainer}>
            <CustomTextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Nhập mật khẩu cũ"
              prefixIcon="lock"
              secureTextEntry={!showOldPassword}
              suffixIcon={showOldPassword ? "eye-off" : "eye"}
              onSuffixPress={() => setShowOldPassword(!showOldPassword)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputContainer}>
            <CustomTextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              prefixIcon="lock"
              secureTextEntry={!showNewPassword}
              suffixIcon={showNewPassword ? "eye-off" : "eye"}
              onSuffixPress={() => setShowNewPassword(!showNewPassword)}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu mới"
              prefixIcon="lock"
              secureTextEntry={!showConfirmPassword}
              suffixIcon={showConfirmPassword ? "eye-off" : "eye"}
              onSuffixPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>

          {newPassword && <PasswordRequirements />}

          <CustomHandleButton
            buttonText={loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            buttonColor={Colors.primary}
            onPress={handleChangePassword}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: 20,
  },
  requirementsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ChangePasswordScreen;