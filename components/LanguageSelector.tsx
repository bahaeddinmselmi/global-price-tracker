import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useSettings } from '@/context/SettingsContext';

type Language = 'en' | 'fr' | 'ar';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

export default function LanguageSelector({ 
  selectedLanguage, 
  onSelectLanguage 
}: LanguageSelectorProps) {
  const { t } = useSettings();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];
  
  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.languageButton,
            selectedLanguage === language.code && styles.selectedLanguage,
          ]}
          onPress={() => onSelectLanguage(language.code as Language)}
        >
          <Text style={styles.flagText}>{language.flag}</Text>
          <Text style={[
            styles.languageText,
            selectedLanguage === language.code && styles.selectedLanguageText,
          ]}>
            {language.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 12,
    minWidth: '30%',
  },
  selectedLanguage: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  flagText: {
    fontSize: 24,
    marginRight: 8,
  },
  languageText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  selectedLanguageText: {
    color: Colors.white,
  },
});