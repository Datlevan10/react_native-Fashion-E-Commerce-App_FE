import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import App from './src/index';

export default function AppEntry() {
  return (
    <>
      <App />
      <StatusBar style="auto" />
    </>
  );
}