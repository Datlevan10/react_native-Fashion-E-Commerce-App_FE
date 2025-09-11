import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import ZaloPayTestComponent from '../../components/Testing/ZaloPayTestComponent';

const ZaloPayTestScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ZaloPay Testing</Text>
      </View>
      
      <ZaloPayTestComponent navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.blackColor,
  },
});

export default ZaloPayTestScreen;