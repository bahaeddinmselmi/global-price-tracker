import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import Colors from '@/constants/Colors';
import { games } from '@/data/gamesData';
import { Lock } from 'lucide-react-native';
import Layout from '@/constants/Layout';

export default function GamesScreen() {
  const { t } = useSettings();
  const isSmallDevice = Layout.window.width < 375;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('games')}</Text>
      <Text style={styles.subtitleText}>{t('chooseGame')}</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gamesGrid}>
          {games.map((game, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.gameCard,
                { width: isSmallDevice ? '100%' : '45%' }
              ]}
              activeOpacity={0.8}
              disabled={game.locked}
            >
              <View style={styles.gameImageContainer}>
                <Image 
                  source={{ uri: game.image }}
                  style={styles.gameImage}
                  resizeMode="cover"
                />
                {game.locked && (
                  <View style={styles.lockedOverlay}>
                    <Lock color={Colors.white} size={24} />
                  </View>
                )}
              </View>
              <Text style={styles.gameTitle}>{t(game.titleKey)}</Text>
              <Text style={styles.gameDescription}>{t(game.descriptionKey)}</Text>
            </TouchableOpacity>
          ))}
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
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  subtitleText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameImageContainer: {
    position: 'relative',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    fontFamily: 'Rounded-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  gameDescription: {
    fontFamily: 'Rounded-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});