import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import { LANGUAGES, changeLanguage, getLanguageFlag } from '../../i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LanguageSelector = ({ visible, onClose, onLanguageSelect }) => {
  const { t, i18n } = useTranslation();
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible]);

  const handleLanguageSelect = async (languageCode) => {
    try {
      const success = await changeLanguage(languageCode);
      if (success) {
        onLanguageSelect && onLanguageSelect(languageCode);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      onClose();
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Handle Bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {t('common:language.select')}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Language Options */}
              <View style={styles.content}>
                {Object.entries(LANGUAGES).map(([code, language]) => {
                  const isSelected = i18n.language === code;
                  return (
                    <TouchableOpacity
                      key={code}
                      style={[
                        styles.languageOption,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => handleLanguageSelect(code)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.languageInfo}>
                        <Text style={styles.flag}>{language.flag}</Text>
                        <View style={styles.languageText}>
                          <Text style={[
                            styles.languageName,
                            isSelected && styles.selectedText
                          ]}>
                            {language.label}
                          </Text>
                          <Text style={[
                            styles.languageSubtitle,
                            isSelected && styles.selectedSubtitle
                          ]}>
                            {code === 'vi' ? 'Tiếng Việt' : 'English'}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Feather 
                          name="check" 
                          size={20} 
                          color={Colors.primary} 
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {t('common:language.select')}
                </Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34, // Safe area padding
    maxHeight: SCREEN_HEIGHT * 0.6,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderColor,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grayBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.grayBgColor,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '15', // 15% opacity
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  selectedText: {
    color: Colors.primary,
  },
  languageSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  selectedSubtitle: {
    color: Colors.primary + 'CC', // 80% opacity
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});

export default LanguageSelector;