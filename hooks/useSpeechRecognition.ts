import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Custom hook for speech recognition
export function useSpeechRecognition(language: string = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  
  // Map language codes to Web Speech API language codes
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'ar': 'ar-SA',
  };

  useEffect(() => {
    // Check if speech recognition is supported
    // This is primarily for web platforms
    if (Platform.OS === 'web') {
      const SpeechRecognition = 
        // @ts-ignore - Web Speech API
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setHasRecognitionSupport(!!SpeechRecognition);
    } else {
      // For native platforms, in a real app we would use native speech recognition
      // For this demo, we'll just show alternate UI
      setHasRecognitionSupport(false);
    }
  }, []);

  const startListening = () => {
    if (!hasRecognitionSupport) return;

    setTranscript('');
    setIsListening(true);

    if (Platform.OS === 'web') {
      try {
        // @ts-ignore - Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = languageMap[language] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (!hasRecognitionSupport) return;
    
    setIsListening(false);

    if (Platform.OS === 'web') {
      try {
        // @ts-ignore - Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
}