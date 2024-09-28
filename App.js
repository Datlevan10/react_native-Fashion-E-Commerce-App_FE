// import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from './screens/HomeScreen';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <HomeScreen />
//     </NavigationContainer>
//   );
// }



// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductDetailScreen from './screens/DetailProductScreen';

export default function App() {
  return (
    // Hiển thị ProductDetailScreen mà không cần NavigationContainer
    <View style={styles.container}>
      <ProductDetailScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Để ProductDetailScreen chiếm toàn bộ màn hình
  },
});
