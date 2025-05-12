import { useEffect, useState } from 'react';
import { Image, StyleSheet, Animated, ViewStyle } from 'react-native';

// Animation state types
type AnimationState = 'idle' | 'happy' | 'sad' | 'celebrating' | 'thinking';

const characterImages = {
  idle: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300',
  happy: 'https://images.pexels.com/photos/8612924/pexels-photo-8612924.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300',
  sad: 'https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300',
  celebrating: 'https://images.pexels.com/photos/8612927/pexels-photo-8612927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300',
  thinking: 'https://images.pexels.com/photos/7130548/pexels-photo-7130548.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300',
};

interface CharacterAnimationProps {
  animationState: AnimationState;
  style?: ViewStyle;
}

export default function CharacterAnimation({ 
  animationState, 
  style 
}: CharacterAnimationProps) {
  const [currentImage, setCurrentImage] = useState(characterImages.idle);
  const [bounceAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    setCurrentImage(characterImages[animationState]);
    
    if (animationState === 'happy' || animationState === 'celebrating') {
      // Happy bounce animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animationState === 'sad') {
      // Sad drop animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animationState === 'celebrating') {
      // Celebrating rotation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();
    } else if (animationState === 'thinking') {
      // Thinking head tilt animation
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animationState]);
  
  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [
            { translateY: bounceAnim },
            { rotate: spin },
          ],
        },
      ]}
    >
      <Image 
        source={{ uri: currentImage }}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
});