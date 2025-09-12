import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainApp from './src/index';

export default function App() {
  return (
    <>
      <MainApp />
      <StatusBar style="auto" />
    </>
  );
}
