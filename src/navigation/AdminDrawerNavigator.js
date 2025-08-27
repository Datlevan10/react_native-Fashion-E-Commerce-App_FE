import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather, MaterialIcons, FontAwesome5, Ionicons } from 'react-native-vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Colors from '../styles/Color';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CustomerManagementScreen from '../screens/CustomerManagementScreen';
import StaffManagementScreen from '../screens/StaffManagementScreen';
import ProductManagementScreen from '../screens/ProductManagementScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import CartManagementScreen from '../screens/CartManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      // Clear all admin tokens
      await SecureStore.deleteItemAsync('admin_access_token');
      await SecureStore.deleteItemAsync('admin_refresh_token');
      await SecureStore.deleteItemAsync('admin_id');
      await SecureStore.deleteItemAsync('admin_token_expiry');
      await SecureStore.deleteItemAsync('user_type');
      
      // Navigate to login - need to go to root navigator
      navigation.getParent().replace('UserTypeSelectionScreen');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      iconType: 'MaterialIcons',
      screen: 'AdminDashboard',
      color: Colors.primary,
    },
    {
      title: 'Customer Management',
      icon: 'users',
      iconType: 'Feather',
      screen: 'CustomerManagement',
      color: Colors.success,
    },
    {
      title: 'Staff Management',
      icon: 'user-friends',
      iconType: 'FontAwesome5',
      screen: 'StaffManagement',
      color: Colors.warning,
    },
    {
      title: 'Product Management',
      icon: 'package',
      iconType: 'Feather',
      screen: 'ProductManagement',
      color: Colors.info,
    },
    {
      title: 'Category Management',
      icon: 'grid',
      iconType: 'Feather',
      screen: 'CategoryManagement',
      color: Colors.secondary,
    },
    {
      title: 'Cart Management',
      icon: 'shopping-cart',
      iconType: 'Feather',
      screen: 'CartManagement',
      color: Colors.primary,
    },
    {
      title: 'Order Management',
      icon: 'shopping-bag',
      iconType: 'Feather',
      screen: 'OrderManagement',
      color: Colors.error,
    },
    {
      title: 'Reports',
      icon: 'bar-chart',
      iconType: 'Feather',
      screen: 'Reports',
      color: '#9c27b0',
    },
  ];

  const renderIcon = (iconName, iconType, color, size = 24) => {
    const iconProps = { name: iconName, size, color };
    
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      default:
        return <Feather {...iconProps} />;
    }
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.adminAvatar}>
          <MaterialIcons name="admin-panel-settings" size={40} color={Colors.whiteColor} />
        </View>
        <Text style={styles.adminName}>Admin Panel</Text>
        <Text style={styles.adminEmail}>Fashion E-Commerce</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              {renderIcon(item.icon, item.iconType, item.color, 20)}
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <Feather name="chevron-right" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.whiteColor,
        headerTitleStyle: {
          fontWeight: '600',
        },
        drawerStyle: {
          backgroundColor: Colors.whiteColor,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          headerTitle: 'Admin Dashboard',
        }}
      />
      <Drawer.Screen
        name="CustomerManagement"
        component={CustomerManagementScreen}
        options={{
          title: 'Customers',
          headerTitle: 'Customer Management',
        }}
      />
      <Drawer.Screen
        name="StaffManagement"
        component={StaffManagementScreen}
        options={{
          title: 'Staff',
          headerTitle: 'Staff Management',
        }}
      />
      <Drawer.Screen
        name="ProductManagement"
        component={ProductManagementScreen}
        options={{
          title: 'Products',
          headerTitle: 'Product Management',
        }}
      />
      <Drawer.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{
          title: 'Categories',
          headerTitle: 'Category Management',
        }}
      />
      <Drawer.Screen
        name="CartManagement"
        component={CartManagementScreen}
        options={{
          title: 'Carts',
          headerTitle: 'Cart Management',
        }}
      />
      <Drawer.Screen
        name="OrderManagement"
        component={OrderManagementScreen}
        options={{
          title: 'Orders',
          headerTitle: 'Order Management',
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          headerTitle: 'Reports & Analytics',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  drawerHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  adminAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.whiteColor,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.whiteColor,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.error,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdminDrawerNavigator;