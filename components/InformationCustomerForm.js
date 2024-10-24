import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from "@expo/vector-icons";


const InformationCustomerForm = ({ address, customerName, phoneNumber }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="map-marker-alt" size={25} color="#036f48" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Shipping Address</Text>
        <Text style={styles.addressText}>{address}</Text>

        <View style={styles.namePhoneRow}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  iconContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 7,
    color: '#333',
  },
  addressText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 7,
    color: '#333',
  },
  namePhoneRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#333',
  },
});

export default InformationCustomerForm;
