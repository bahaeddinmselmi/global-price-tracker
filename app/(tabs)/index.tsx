import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import QuestionCard from '@/components/QuestionCard';
import { getQuestions } from '@/services/questionService';
import Colors from '@/constants/Colors';
import CharacterAnimation from '@/components/CharacterAnimation';
import ProgressBar from '@/components/ProgressBar';
import { Question } from '@/types/Question';
import Layout from '@/constants/Layout';

export default function LearnScreen() {
  const { language, t } = useSettings();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [characterAnimation, setCharacterAnimation] = useState('idle');

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    const loadQuestions = async () => {
      const loadedQuestions = await getQuestions(language);
      setQuestions(loadedQuestions);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    };

    loadQuestions();
  }, [language]);

  const handleAnswer = (correct: boolean) => {
    if (answered) return;
    
    setIsCorrect(correct);
    setAnswered(true);
    
    if (correct) {
      setScore(score + 1);
      setCharacterAnimation('happy');
    } else {
      setCharacterAnimation('sad');
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // End of questions - could show summary
        setCharacterAnimation('celebrating');
      }
      setAnswered(false);
      setCharacterAnimation('idle');
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length}
        />
        <Text style={styles.scoreText}>
          {t('score')}: {score}
        </Text>
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <CharacterAnimation 
          style={styles.character}
          animationState={characterAnimation} 
        />
        
        <QuestionCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          answered={answered}
          isCorrect={isCorrect}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'web' ? 30 : 50,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 18,
    color: Colors.text,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  character: {
    position: 'absolute',
    top: 0,
    left: Layout.window.width > 500 ? 40 : 10,
    width: 150,
    height: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Rounded-Regular',
    fontSize: 18,
    color: Colors.text,
  },
});