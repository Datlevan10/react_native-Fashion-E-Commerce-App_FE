import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const defaultAvatar = require("../../../assets/image/men.jpg");

const CustomerCard = ({ customer, onPress, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return Colors.success;
      case "inactive":
        return Colors.error;
      case "suspended":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getCustomerTypeIcon = () => {
    if (customer.total_orders > 20) {
      return { name: "star", color: Colors.yellowColor };
    } else if (customer.total_orders > 10) {
      return { name: "award", color: Colors.primary };
    } else if (customer.total_orders > 0) {
      return { name: "user-check", color: Colors.success };
    }
    return { name: "user", color: Colors.textSecondary };
  };

  const customerIcon = getCustomerTypeIcon();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image
            source={customer.image ? { uri: customer.image } : defaultAvatar}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{customer.full_name}</Text>
              <Feather
                name={customerIcon.name}
                size={14}
                color={customerIcon.color}
              />
            </View>
            <Text style={styles.email}>{customer.email}</Text>
            <View style={styles.contactInfo}>
              <Feather name="phone" size={14} color={Colors.textSecondary} />
              <Text style={styles.phone}>{customer.phone_number || "N/A"}</Text>
            </View>
            <View style={styles.locationInfo}>
              <Feather name="map-pin" size={14} color={Colors.textSecondary} />
              <Text style={styles.address} numberOfLines={1}>
                {customer.address || "No address"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(customer.status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(customer.status) }]}>
              {customer.status}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const newStatus = customer.status === "active" ? "inactive" : "active";
              onStatusChange(newStatus);
            }}
          >
            <Feather 
              name={customer.status === "active" ? "user-x" : "user-check"} 
              size={16} 
              color={customer.status === "active" ? Colors.error : Colors.success}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{customer.total_orders || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${(customer.total_spent || 0).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatJoinDate(customer.created_at)}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
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
    marginBottom: 16,
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
    marginRight: 8,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  phone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
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
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    borderTopOpacity: 0.2,
    paddingTop: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default CustomerCard;