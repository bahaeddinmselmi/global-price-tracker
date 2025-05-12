export interface Question {
  id: string;
  type: 'image' | 'multiple-choice' | 'word';
  questionText: string;
  imageUrl: string;
  correctAnswer: string;
  options?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'animals' | 'colors' | 'numbers' | 'shapes' | 'alphabet';
  audioUrl?: string;
}