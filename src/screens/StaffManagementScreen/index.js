import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import StaffCard from "../../components/Admin/StaffCard";
import CustomButton from "../../components/Button/CustomButton";

export default function StaffManagementScreen({ navigation }) {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchQuery, staff]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllStaff();
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      Alert.alert("Error", "Failed to fetch staff data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStaffData();
    setRefreshing(false);
  };

  const filterStaff = () => {
    if (!searchQuery.trim()) {
      setFilteredStaff(staff);
      return;
    }

    const filtered = staff.filter((member) =>
      member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const handleDeleteStaff = async (staffId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this staff member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deleteStaff(staffId);
              setStaff(staff.filter((s) => s.id !== staffId));
              Alert.alert("Success", "Staff member deleted successfully");
            } catch (error) {
              console.error("Error deleting staff:", error);
              Alert.alert("Error", "Failed to delete staff member");
            }
          },
        },
      ]
    );
  };

  const renderStaffCard = ({ item }) => (
    <StaffCard
      staff={item}
      onPress={() =>
        navigation.navigate("StaffProfileScreen", { staffId: item.id })
      }
      onEdit={() =>
        navigation.navigate("EditStaffScreen", { staffId: item.id })
      }
      onDelete={() => handleDeleteStaff(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddStaffScreen")}
        >
          <Feather name="plus" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff by name, email, role, or department..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{staff.length}</Text>
          <Text style={styles.statLabel}>Total Staff</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {staff.filter((s) => s.status === "active").length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {new Set(staff.map((s) => s.department)).size}
          </Text>
          <Text style={styles.statLabel}>Departments</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="users" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Staff Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? "Try adjusting your search criteria" : "Add your first staff member to get started"}
      </Text>
      {!searchQuery && (
        <CustomButton
          title="Add Staff Member"
          onPress={() => navigation.navigate("AddStaffScreen")}
          style={styles.emptyButton}
        />
      )}
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
        <FlatList
          data={filteredStaff}
          renderItem={renderStaffCard}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmptyList : null}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
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
  listContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
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
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.whiteColor,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 16,
  },
});