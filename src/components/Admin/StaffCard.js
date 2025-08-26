import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const defaultAvatar = require("../../../assets/image/men.jpg");

const StaffCard = ({ staff, onPress, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return Colors.success;
      case "inactive":
        return Colors.error;
      case "on_leave":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "shield";
      case "manager":
        return "briefcase";
      case "staff":
        return "user";
      case "cashier":
        return "dollar-sign";
      default:
        return "user";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image
            source={staff.avatar ? { uri: staff.avatar } : defaultAvatar}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{staff.full_name}</Text>
              {staff.is_verified && (
                <MaterialIcons name="verified" size={16} color={Colors.blueProduct} />
              )}
            </View>
            <Text style={styles.email}>{staff.email}</Text>
            <View style={styles.roleContainer}>
              <Feather
                name={getRoleIcon(staff.role)}
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.role}>{staff.role}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.department}>{staff.department}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(staff.status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(staff.status) }]}>
              {staff.status}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={onEdit}
            >
              <Feather name="edit-2" size={16} color={Colors.blueProduct} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Feather name="trash-2" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Feather name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>Joined {staff.join_date}</Text>
        </View>
        <View style={styles.footerItem}>
          <Feather name="dollar-sign" size={14} color={Colors.success} />
          <Text style={styles.footerText}>${staff.salary?.toLocaleString()}/month</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginRight: 6,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  role: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginLeft: 4,
    textTransform: "capitalize",
  },
  separator: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginHorizontal: 6,
  },
  department: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: `${Colors.blueProduct}15`,
  },
  deleteButton: {
    backgroundColor: `${Colors.error}15`,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    borderTopOpacity: 0.2,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});

export default StaffCard;