import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { Mic, Volume2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Question } from '@/types/Question';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeech } from '@/hooks/useSpeech';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
  isCorrect: boolean;
}

export default function QuestionCard({ 
  question, 
  onAnswer, 
  answered, 
  isCorrect 
}: QuestionCardProps) {
  const { t, language, voiceEnabled } = useSettings();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  
  const { 
    startListening, 
    stopListening, 
    transcript, 
    isListening, 
    hasRecognitionSupport 
  } = useSpeechRecognition(language);
  
  const { speak, isSpeaking } = useSpeech();
  
  // Speak the question when it's displayed
  useEffect(() => {
    if (voiceEnabled) {
      speak(question.questionText, language);
    }
  }, [question, voiceEnabled]);
  
  // Check answer when transcript changes
  useEffect(() => {
    if (!transcript || transcript === '' || !hasRecognitionSupport || answered) return;
    
    const userAnswer = transcript.toLowerCase().trim();
    const correctAnswer = question.correctAnswer.toLowerCase();
    
    // Simple fuzzy matching - in a real app, we would use a more sophisticated matching algorithm
    const isCorrect = userAnswer.includes(correctAnswer) || 
                      correctAnswer.includes(userAnswer);
    
    if (userAnswer.length > 2) {
      onAnswer(isCorrect);
      
      // Animate feedback
      if (isCorrect) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [transcript]);
  
  const handleSpeakQuestion = () => {
    speak(question.questionText, language);
  };
  
  const handleMicPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const getFeedbackColor = () => {
    if (!answered) return Colors.tertiary;
    return isCorrect ? Colors.success : Colors.error;
  };
  
  const getFeedbackText = () => {
    if (!answered) return '';
    return isCorrect ? t('correct') : t('incorrect');
  };

  // Handle platforms without speech recognition
  const renderMicButton = () => {
    if (!hasRecognitionSupport) {
      return (
        <View style={styles.micUnsupportedContainer}>
          <Text style={styles.micUnsupportedText}>
            {t('speechNotSupported')}
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
            onPress={() => onAnswer(true)} // Simulate correct answer for testing
          >
            <Text style={styles.actionButtonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.error }]}
            onPress={() => onAnswer(false)} // Simulate incorrect answer for testing
          >
            <Text style={styles.actionButtonText}>✗</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <TouchableOpacity 
        style={[
          styles.micButton, 
          isListening && styles.micButtonActive
        ]}
        onPress={handleMicPress}
      >
        <Mic color={isListening ? Colors.white : Colors.text} size={28} />
        {isListening && (
          <Text style={styles.speakNowText}>{t('speakNow')}</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.questionText}</Text>
        
        {voiceEnabled && (
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={handleSpeakQuestion}
            disabled={isSpeaking}
          >
            {isSpeaking ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Volume2 color={Colors.primary} size={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: question.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      {answered && (
        <View style={[styles.feedbackContainer, { backgroundColor: getFeedbackColor() }]}>
          <Text style={styles.feedbackText}>{getFeedbackText()}</Text>
        </View>
      )}
      
      <View style={styles.controlsContainer}>
        {renderMicButton()}
        
        {transcript && !answered && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  micButtonActive: {
    backgroundColor: Colors.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  speakNowText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 12,
    color: Colors.white,
    marginTop: 8,
  },
  transcriptContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    width: '100%',
  },
  transcriptText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  feedbackContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  feedbackText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  micUnsupportedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  micUnsupportedText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionButtonText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 24,
    color: Colors.white,
  },
});