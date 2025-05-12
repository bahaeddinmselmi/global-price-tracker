import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import Colors from '@/constants/Colors';
import LanguageSelector from '@/components/LanguageSelector';
import Layout from '@/constants/Layout';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    t, 
    language, 
    setLanguage, 
    soundEnabled, 
    setSoundEnabled, 
    voiceEnabled, 
    setVoiceEnabled,
    darkMode,
    setDarkMode
  } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('settings')}</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <LanguageSelector 
            selectedLanguage={language} 
            onSelectLanguage={setLanguage} 
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('audio')}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Volume2 color={Colors.text} size={24} />
              <Text style={styles.settingLabel}>{t('sounds')}</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : soundEnabled ? Colors.white : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              {voiceEnabled ? 
                <Volume2 color={Colors.text} size={24} /> : 
                <VolumeX color={Colors.text} size={24} />
              }
              <Text style={styles.settingLabel}>{t('voice')}</Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : voiceEnabled ? Colors.white : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              {darkMode ? 
                <Moon color={Colors.text} size={24} /> : 
                <Sun color={Colors.text} size={24} />
              }
              <Text style={styles.settingLabel}>{t('darkMode')}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : darkMode ? Colors.white : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          <Text style={styles.aboutText}>{t('appVersion')}: 1.0.0</Text>
          <Text style={styles.aboutText}>{t('appDescription')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  headerText: {
    fontFamily: 'Quirky-Bold',
    fontSize: 32,
    color: Colors.text,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Rounded-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Rounded-Regular',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  aboutText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});