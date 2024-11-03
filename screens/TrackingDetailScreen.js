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
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../themes/Color";
import ProductInOrder from "../components/ProductInOrder";
import TrackingInfo from "../components/TrackingForm";
import CustomHandleButton from "../components/CustomHandleButton";

import imageTest from "../assets/image/nguyen_thanh_chuc.jpg";

export default function TrackingDetailScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>Tracking Details</Text>
          <View style={styles.placeholder} />
        </View>
      </View>
      <View style={styles.body}>
        <ProductInOrder
          image={imageTest}
          productName="Củ sạc nhanh Apple iPhone"
          description="Space White Colors, 20W Type-C"
          orderId="1234KJSJFH"
        />
        <View style={styles.divider} />
        <TrackingInfo
          addressFrom="Meeeeeeeeee"
          addressTo="Nguyễn Thanh Chúc - P. Văn Quán, Q. Hà Đông, Tp. Hà Nội."
          weight="0.2 kg"
        />
        <View style={styles.divider} />
        <CustomHandleButton
          buttonText="Live Tracking"
          buttonColor="#036f48"
          onPress={() => console.log("Tracking clicked")}
        />
      </View>
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
    fontSize: 18,
    color: Colors.blackColor,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 15,
  },
  placeholder: {
    width: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
});
