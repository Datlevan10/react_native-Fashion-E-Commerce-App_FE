import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";

export default function CustomerDetailsScreen({ route, navigation }) {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomerById(customerId);
      const customerData = response.data.data || response.data;
      setCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin khách hàng");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin khách hàng</Text>
      </View>
    );
  }

  const InfoRow = ({ icon, label, value, iconColor = Colors.textSecondary }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "Chưa có thông tin"}</Text>
      </View>
    </View>
  );

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
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
          <Text style={styles.headerTitle}>Chi tiết khách hàng</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <MaterialIcons name="person" size={40} color={Colors.whiteColor} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.customerName}>{customer.full_name || "Không có tên"}</Text>
                <View style={styles.statusBadge}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: customer.status === 'active' ? Colors.success : Colors.error }
                  ]} />
                  <Text style={styles.statusText}>
                    {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <StatCard 
                title="Tổng đơn hàng" 
                value={customer.total_orders || 0} 
                color={Colors.primary} 
              />
              <StatCard 
                title="Tổng chi tiêu" 
                value={`${(customer.total_spent || 0).toLocaleString('vi-VN')}đ`} 
                color={Colors.success} 
              />
              <StatCard 
                title="Điểm tích lũy" 
                value={customer.loyalty_points || 0} 
                color={Colors.warning} 
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <InfoRow 
              icon="mail" 
              label="Email" 
              value={customer.email}
              iconColor={Colors.info}
            />
            <InfoRow 
              icon="phone" 
              label="Số điện thoại" 
              value={customer.phone_number}
              iconColor={Colors.success}
            />
            <InfoRow 
              icon="map-pin" 
              label="Địa chỉ" 
              value={customer.address}
              iconColor={Colors.warning}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            <InfoRow 
              icon="calendar" 
              label="Ngày sinh" 
              value={customer.birth_date ? new Date(customer.birth_date).toLocaleDateString('vi-VN') : null}
              iconColor={Colors.primary}
            />
            <InfoRow 
              icon="users" 
              label="Giới tính" 
              value={customer.gender === 'male' ? 'Nam' : customer.gender === 'female' ? 'Nữ' : 'Khác'}
              iconColor={Colors.secondary}
            />
            <InfoRow 
              icon="clock" 
              label="Ngày đăng ký" 
              value={customer.created_at ? new Date(customer.created_at).toLocaleDateString('vi-VN') : null}
              iconColor={Colors.textSecondary}
            />
            <InfoRow 
              icon="edit" 
              label="Cập nhật lần cuối" 
              value={customer.updated_at ? new Date(customer.updated_at).toLocaleDateString('vi-VN') : null}
              iconColor={Colors.info}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
            <InfoRow 
              icon="credit-card" 
              label="Phương thức thanh toán ưa thích" 
              value={customer.preferred_payment_method || "Chưa có thông tin"}
              iconColor={Colors.primary}
            />
            <InfoRow 
              icon="dollar-sign" 
              label="Giá trị đơn hàng trung bình" 
              value={customer.average_order_value ? `${customer.average_order_value.toLocaleString('vi-VN')}đ` : "Chưa có thông tin"}
              iconColor={Colors.success}
            />
            <InfoRow 
              icon="shopping-cart" 
              label="Lần mua hàng gần nhất" 
              value={customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString('vi-VN') : "Chưa có thông tin"}
              iconColor={Colors.warning}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>
                {customer.notes || "Không có ghi chú"}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors.primary }]}
              onPress={() => navigation.navigate('OrderManagement', { customerId })}
            >
              <Feather name="shopping-bag" size={20} color={Colors.whiteColor} />
              <Text style={styles.actionButtonText}>Xem đơn hàng</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderTopWidth: 3,
    minWidth: 100,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.whiteColor,
    marginLeft: 8,
  },
  notesContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});