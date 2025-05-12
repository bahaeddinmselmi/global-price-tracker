import { useState } from 'react';
import { Platform } from 'react-native';

// Language map for speech synthesis
const languageMap: Record<string, string> = {
  'en': 'en-US',
  'fr': 'fr-FR',
  'ar': 'ar-SA',
};

// Custom hook for speech synthesis
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Character voices map (in a real app these would be professionally recorded)
  const voiceMap: Record<string, string> = {
    'en': 'en-US-male',
    'fr': 'fr-FR-female',
    'ar': 'ar-SA-male',
  };

  const speak = (text: string, language: string = 'en') => {
    if (Platform.OS === 'web') {
      try {
        // Web Speech API
        if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = languageMap[language] || 'en-US';
          
          // Try to find an appropriate voice
          const voices = window.speechSynthesis.getVoices();
          const langVoices = voices.filter(voice => voice.lang.includes(languageMap[language]));
          
          if (langVoices.length > 0) {
            // Randomly choose a voice for variety
            const randomIndex = Math.floor(Math.random() * langVoices.length);
            utterance.voice = langVoices[randomIndex];
          }
          
          // Adjust rate and pitch for a more kid-friendly voice
          utterance.rate = 0.9; // Slightly slower
          utterance.pitch = 1.2; // Slightly higher
          
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error('Error with speech synthesis:', error);
        setIsSpeaking(false);
      }
    } else {
      // For native platforms, in a real app we'd use Expo Speech
      // For this demo, we'll simulate
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const stop = () => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
  };
}