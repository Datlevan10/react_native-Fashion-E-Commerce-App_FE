import {
  Text,
  View,
  Button,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../styles/Color";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import InformationCustomerForm from "../../components/Profile/InformationCustomerForm";
import ItemInCart from "../../components/Cart/ItemInCart";
import ItemDetail from "../../components/Cart/ItemDetail";
import SelectShipping from "../../components/Cart/SelectShipping";
import PaymentMethod from "../../components/Cart/PaymentMethod";

import imageTest from "../../../assets/image/kid-2.jpg";

export default function CheckoutScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(
    "123 Duong Pham Ngu Lao, Phuong Hiep Thanh 3, Thu Dau Mot City, Tinh Binh Duong"
  );
  const [customerName, setCustomerName] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("+84 123456789");
  const [newAddress, setNewAddress] = useState(address);
  const [newCustomerName, setNewCustomerName] = useState(customerName);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);

  const [note, setNote] = useState("");
  const [totalAmount, setTotalAmount] = useState(404.99);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleSave = () => {
    setAddress(newAddress);
    setCustomerName(newCustomerName);
    setPhoneNumber(newPhoneNumber);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmitOrder = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.titleEditText}>
          <Text style={styles.title}></Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.editText}>Change</Text>
          </TouchableOpacity>
        </View>
        <InformationCustomerForm
          address={address}
          customerName={customerName}
          phoneNumber={phoneNumber}
        />
        {/* <View style={styles.titleEditText}>
          <Text style={styles.title}></Text>
        </View> */}
        <ItemInCart
          image={imageTest}
          productName="Wrapover cotton dress"
          price="399.00"
          color="Space White Color"
          size="S"
          quantity="1"
        />
        {/* <ItemDetail
          productImage={imageTest}
          categoryName="Dress"
          productName="Dress Kid"
          price="$399.00"
          color="White"
          size="S"
          quantity="1"
        /> */}
        <View style={styles.titleEditText}>
          <Text style={styles.title}>Select Shipping</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.editText}>See all options</Text>
          </TouchableOpacity>
        </View>
        <SelectShipping
          shippingMethod="Standard Shipping"
          estimatedTime="Estimated arrived 3-5 days"
          price="5.99"
        />
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Type any message..."
            value={note}
            onChangeText={setNote}
          />
        </View>
        <View style={styles.subtotalContainer}>
          <View style={styles.subItem}>
            <Text style={styles.subTotalText}>Subtotal,</Text>
            <Text style={styles.itemCountText}>3 items</Text>
          </View>
          <Text style={styles.totalSubText}>$ 404.99</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.titleEditText}>
          <Text style={styles.title}>Payment Method</Text>
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paymentMethod}
          >
            <TouchableOpacity
              onPress={() => handleSelectPaymentMethod("Credit Card")}
            >
              <PaymentMethod
                icon="credit-card"
                nameMethod="Credit Card"
                subTitle="Pay card when the medicine arrives at the destination."
                isSelected={selectedPaymentMethod === "Credit Card"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectPaymentMethod("Bank Transfer")}
            >
              <PaymentMethod
                icon="bank"
                nameMethod="Bank Transfer"
                subTitle="Login to your online account and make payment."
                isSelected={selectedPaymentMethod === "Bank Transfer"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectPaymentMethod("PayPal")}
            >
              <PaymentMethod
                icon="paypal"
                nameMethod="PayPal"
                subTitle="Pay via your PayPal account."
                isSelected={selectedPaymentMethod === "PayPal"}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalAmountContainer}>
          <View>
            <Text style={styles.totalAmountTitle}>Total</Text>
            <Text style={styles.totalPriceText}>$ {totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={handleSubmitOrder}
            style={styles.submitOrderButton}
          >
            <Text style={styles.submitOrderText}>Submit Order</Text>
            {/* <MaterialIcons name="shopping-cart-checkout" size={22} color={Colors.whiteColor} /> */}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Feather name="x" size={24} color="#db4437" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Edit Information</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={newAddress}
                    onChangeText={setNewAddress}
                    placeholder="Enter new address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="account-circle"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={newCustomerName}
                    onChangeText={setNewCustomerName}
                    placeholder="Enter new name"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="phone"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={newPhoneNumber}
                    onChangeText={setNewPhoneNumber}
                    placeholder="Enter new phone number"
                    keyboardType="decimal-pad"
                    maxLength={10}
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  container: {
    // flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 25,
    color: Colors.blackColor,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 7,
  },
  titleEditText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
  },
  editText: {
    color: "#0288d1",
    fontSize: 18,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  saveButton: {
    backgroundColor: "#179e7a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentMethod: {
    gap: 15,
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  noteInput: {
    fontSize: 17,
    color: Colors.blackColor,
  },
  subItem: {
    flexDirection: "row",
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  subTotalText: {
    fontSize: 18,
    fontWeight: "500",
  },
  itemCountText: {
    fontSize: 18,
    color: "#333",
  },
  totalSubText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#036f48",
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5
  },
  itemCountText: {
    fontSize: 20,
    color: Colors.darkGray,
  },
  totalAmountTitle: {
    fontSize: 20,
  },
  totalPriceText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginRight: 10,
  },
  submitOrderButton: {
    backgroundColor: "#036f48",
    flexDirection: "row",
    gap: 10,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  submitOrderText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "bold",
  },
});
