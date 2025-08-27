import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import LanguageSelector from '../../components/Language/LanguageSelector';
import { LANGUAGES, getLanguageFlag, getLanguageCode } from '../../i18n';

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const currentLanguage = LANGUAGES[i18n.language];

  const settingSections = [
    {
      title: t('settings:sections.language.title'),
      items: [
        {
          id: 'language',
          title: t('settings:sections.language.current_language'),
          value: currentLanguage?.label || 'English',
          icon: 'globe',
          onPress: () => setShowLanguageSelector(true),
          showArrow: true,
        },
      ],
    },
    {
      title: t('settings:sections.account.title'),
      items: [
        {
          id: 'profile',
          title: t('settings:sections.account.edit_profile'),
          icon: 'user',
          onPress: () => navigation.navigate('DetailProfileScreen'),
          showArrow: true,
        },
        {
          id: 'privacy',
          title: t('settings:sections.account.privacy'),
          icon: 'shield',
          onPress: () => console.log('Privacy pressed'),
          showArrow: true,
        },
      ],
    },
    {
      title: t('settings:sections.notifications.title'),
      items: [
        {
          id: 'push',
          title: t('settings:sections.notifications.push'),
          icon: 'bell',
          onPress: () => console.log('Notifications pressed'),
          showArrow: true,
        },
      ],
    },
    {
      title: t('settings:sections.support.title'),
      items: [
        {
          id: 'help',
          title: t('settings:sections.support.help'),
          icon: 'help-circle',
          onPress: () => console.log('Help pressed'),
          showArrow: true,
        },
        {
          id: 'contact',
          title: t('settings:sections.support.contact'),
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
        <Text style={styles.headerTitle}>{t('settings:title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Language Display */}
        <View style={styles.currentLanguageContainer}>
          <View style={styles.languageDisplay}>
            <Text style={styles.languageFlag}>
              {getLanguageFlag(i18n.language)}
            </Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>
                {currentLanguage?.label || 'English'}
              </Text>
              <Text style={styles.languageCode}>
                {getLanguageCode(i18n.language)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeLanguageButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Text style={styles.changeLanguageText}>{t('settings:sections.language.change')}</Text>
            <Feather name="chevron-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingSections.map(renderSection)}

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Fashion E-Commerce App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageSelect={(language) => {
          console.log('Language changed to:', language);
        }}
      />
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
  currentLanguageContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  changeLanguageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
  },
  changeLanguageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  section: {
    marginBottom: 24,
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