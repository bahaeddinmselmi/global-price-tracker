import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import Colors from '@/constants/Colors';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: current / total,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [current, total]);
  
  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.progress,
          { width }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: Colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    width: '60%',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
});