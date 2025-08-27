import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import { getLanguageCode } from '../../i18n';

const LanguageIndicator = ({ onPress, style, showLabel = false }) => {
  const { i18n, t } = useTranslation();
  const currentLanguageCode = getLanguageCode(i18n.language);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.languageText}>{currentLanguageCode}</Text>
        {showLabel && (
          <Text style={styles.label}>{t('common:language.select')}</Text>
        )}
        <Feather name="chevron-down" size={16} color={Colors.whiteColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    color: Colors.whiteColor,
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 4,
  },
});

export default LanguageIndicator;