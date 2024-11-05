import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryScreen from './screens/ExploreScreen/ExploreScreen';
import ProductDetailScreen from './screens/DetailProductScreen';
import CartScreen from './screens/CartScreen/CartScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen/ForgotPasswordScreen';
import CheckoutScreen from './screens/CheckoutScreen/CheckoutScreen';
import TrackingDetailScreen from './screens/CheckoutScreen/TrackingDetailScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import ManagerProfileScreen from './screens/ProfileScreen/ManagerProfileScreen';
import DetailProfileScreen from './screens/ProfileScreen/DetailProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CartPage" 
          component={CartScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPasswordScreen" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CheckoutScreen" 
          component={CheckoutScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrackingDetailScreen" 
          component={TrackingDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ManagerProfileScreen" 
          component={ManagerProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DetailProfileScreen" 
          component={DetailProfileScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
