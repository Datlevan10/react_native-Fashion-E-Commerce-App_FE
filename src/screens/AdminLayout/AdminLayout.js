import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import CustomDrawer from '../../components/CustomDrawer/CustomDrawer';
import CustomDrawerContent from '../../components/CustomDrawer/CustomDrawerContent';

// Import Admin Screens
import AdminDashboardScreen from '../AdminDashboardScreen';
import PlaceholderScreen from '../../components/PlaceholderScreen';

// Create placeholder components for screens that might have issues
const CustomerManagementScreen = () => <PlaceholderScreen title="Customer Management" />;
const StaffManagementScreen = () => <PlaceholderScreen title="Staff Management" />;
const ProductManagementScreen = () => <PlaceholderScreen title="Product Management" />;
const CategoryManagementScreen = () => <PlaceholderScreen title="Category Management" />;
const CartManagementScreen = () => <PlaceholderScreen title="Cart Management" />;
const OrderManagementScreen = () => <PlaceholderScreen title="Order Management" />;
const ReportsScreen = () => <PlaceholderScreen title="Reports & Analytics" />;

const Stack = createStackNavigator();

const AdminLayout = ({ navigation }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const HeaderLeft = () => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={openDrawer}
    >
      <Feather name="menu" size={24} color={Colors.whiteColor} />
    </TouchableOpacity>
  );

  const screenOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTintColor: Colors.whiteColor,
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerLeft: HeaderLeft,
  };

  return (
    <CustomDrawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      drawerContent={
        <CustomDrawerContent
          navigation={navigation}
          onClose={closeDrawer}
        />
      }
    >
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Bảng điều khiển quản trị',
          }}
        />
        <Stack.Screen
          name="CustomerManagement"
          component={CustomerManagementScreen}
          options={{
            title: 'Quản lý khách hàng',
          }}
        />
        <Stack.Screen
          name="StaffManagement"
          component={StaffManagementScreen}
          options={{
            title: 'Quản lý nhân viên',
          }}
        />
        <Stack.Screen
          name="ProductManagement"
          component={ProductManagementScreen}
          options={{
            title: 'Quản lý sản phẩm',
          }}
        />
        <Stack.Screen
          name="CategoryManagement"
          component={CategoryManagementScreen}
          options={{
            title: 'Quản lý danh mục',
          }}
        />
        <Stack.Screen
          name="CartManagement"
          component={CartManagementScreen}
          options={{
            title: 'Quản lý giỏ hàng',
          }}
        />
        <Stack.Screen
          name="OrderManagement"
          component={OrderManagementScreen}
          options={{
            title: 'Quản lý đơn hàng',
          }}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            title: 'Báo cáo & Phân tích',
          }}
        />
      </Stack.Navigator>
    </CustomDrawer>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default AdminLayout;