import { Tabs } from 'expo-router';
import { useSettings } from '@/context/SettingsContext';
import { StyleSheet, View } from 'react-native';
import { Book, TowerControl as GameController, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const { t, language } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('learn'),
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Book color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: t('games'),
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <GameController color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Settings color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: Colors.white,
  },
  tabBarLabel: {
    fontFamily: 'Rounded-Regular',
    fontSize: 12,
  },
  iconContainer: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});