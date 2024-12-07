import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import apiService from "../../api/ApiService";
import Colors from "../../styles/Color";
import NotificationCard from "../../components/NotificationCard";
import { Feather, MaterialIcons } from "react-native-vector-icons";
import { formatDistanceToNow } from "date-fns";
import API_BASE_URL from "../../config/config";

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const customer_id = await SecureStore.getItemAsync("customer_id");
      if (!customer_id) {
        Alert.alert("Error", "No customer ID found.");
        return;
      }

      const response = await apiService.getNotification(customer_id);
      if (response.status === 200) {
        const notificationsData = response.data.data.map((item) => {
          const mappedItem = {
            id: item.notification_id,
            message: item.message,
            isRead: item.is_read,
            createdAt: item.created_at,
            timeAgo: formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
            }),
            relatedData: {
              productName: item.related_data.product_name,
              images: item.related_data.image.map(
                (img) => `${API_BASE_URL}${img.url}`
              ),
              price: item.related_data.price,
            },
          };
          return mappedItem;
        });

        setNotifications(notificationsData);
      } else {
        Alert.alert("Error", "Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const groupNotifications = () => {
    const today = [];
    const yesterday = [];
    const last7Days = [];
    const last30Days = [];
    const earlier = [];

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfLast7Days = new Date(startOfToday);
    startOfLast7Days.setDate(startOfToday.getDate() - 7);
    const startOfLast30Days = new Date(startOfToday);
    startOfLast30Days.setDate(startOfToday.getDate() - 30);

    notifications.forEach((notification) => {
      const createdAt = new Date(notification.createdAt);

      if (createdAt >= startOfToday) {
        today.push(notification);
      } else if (createdAt >= startOfYesterday && createdAt < startOfToday) {
        yesterday.push(notification);
      } else if (
        createdAt >= startOfLast7Days &&
        createdAt < startOfYesterday
      ) {
        last7Days.push(notification);
      } else if (
        createdAt >= startOfLast30Days &&
        createdAt < startOfLast7Days
      ) {
        last30Days.push(notification);
      } else {
        earlier.push(notification);
      }
    });

    const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

    return {
      today: today.sort(sortByDate),
      yesterday: yesterday.sort(sortByDate),
      last7Days: last7Days.sort(sortByDate),
      last30Days: last30Days.sort(sortByDate),
      earlier: earlier.sort(sortByDate),
    };
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { today, yesterday, last7Days, last30Days, earlier } =
    groupNotifications();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Notifications</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.notificationList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {today.length > 0 && (
            <View>
              <Text style={styles.groupTitle}>Today</Text>
              {today.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  relatedData={notification.relatedData}
                  timeAgo={notification.timeAgo}
                />
              ))}
            </View>
          )}
          {yesterday.length > 0 && (
            <View>
              <Text style={styles.groupTitle}>Yesterday</Text>
              {yesterday.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  relatedData={notification.relatedData}
                  timeAgo={notification.timeAgo}
                />
              ))}
            </View>
          )}

          {last7Days.length > 0 && (
            <View>
              <Text style={styles.groupTitle}>Last 7 days</Text>
              {last7Days.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  relatedData={notification.relatedData}
                  timeAgo={notification.timeAgo}
                />
              ))}
            </View>
          )}
          {last30Days.length > 0 && (
            <View>
              <Text style={styles.groupTitle}>Last 30 days</Text>
              {last30Days.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  relatedData={notification.relatedData}
                  timeAgo={notification.timeAgo}
                />
              ))}
            </View>
          )}
          {earlier.length > 0 && (
            <View>
              <Text style={styles.groupTitle}>Earlier</Text>
              {earlier.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  relatedData={notification.relatedData}
                  timeAgo={notification.timeAgo}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayBgColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.grayBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: Colors.grayBgColor,
    backgroundColor: Colors.grayBgColor,
  },
  titleContainer: {
    marginLeft: 8,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
  },
  notificationList: {},
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginLeft: 18,
    color: Colors.blackColor,
  },
});
