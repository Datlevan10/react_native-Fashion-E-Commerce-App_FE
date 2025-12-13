import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';

const SettingsScreen = ({ navigation }) => {
  const settingSections = [
    {
      title: 'Cài đặt tài khoản',
      items: [
        {
          id: 'profile',
          title: 'Chỉnh sửa hồ sơ',
          icon: 'user',
          onPress: () => navigation.navigate('DetailProfileScreen'),
          showArrow: true,
        },
        {
          id: 'changePassword',
          title: 'Đổi mật khẩu',
          icon: 'lock',
          onPress: () => {
            console.log('Navigating to ChangePasswordScreen');
            navigation.navigate('ChangePasswordScreen');
          },
          showArrow: true,
        },
        {
          id: 'privacy',
          title: 'Quyền riêng tư & Bảo mật',
          icon: 'shield',
          onPress: () => console.log('Privacy pressed'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Thông báo',
      items: [
        {
          id: 'push',
          title: 'Thông báo đẩy',
          icon: 'bell',
          onPress: () => console.log('Notifications pressed'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          id: 'help',
          title: 'Trợ giúp & Câu hỏi thường gặp',
          icon: 'help-circle',
          onPress: () => console.log('Help pressed'),
          showArrow: true,
        },
        {
          id: 'contact',
          title: 'Liên hệ chúng tôi',
          icon: 'mail',
          onPress: () => console.log('Contact pressed'),
          showArrow: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Feather name={item.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.settingItemContent}>
          <Text style={styles.settingItemTitle}>{item.title}</Text>
          {item.value && (
            <Text style={styles.settingItemValue}>{item.value}</Text>
          )}
        </View>
      </View>
      {item.showArrow && (
        <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={Colors.blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Settings Sections */}
        {settingSections.map(renderSection)}

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Computer Store App</Text>
          <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.whiteColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingItemValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default SettingsScreen;