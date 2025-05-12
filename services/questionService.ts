import { Question } from '@/types/Question';

// Sample image URLs from Pexels (ensure these exist)
const imageUrls = {
  dog: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
  cat: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600',
  elephant: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=600',
  lion: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=600',
  zebra: 'https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg?auto=compress&cs=tinysrgb&w=600',
  giraffe: 'https://images.pexels.com/photos/34482/giraffe-animals-zoo-funny.jpg?auto=compress&cs=tinysrgb&w=600',
  apple: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600',
  banana: 'https://images.pexels.com/photos/47305/bananas-banana-shrub-fruits-yellow-47305.jpeg?auto=compress&cs=tinysrgb&w=600',
  red: 'https://images.pexels.com/photos/40465/pexels-photo-40465.jpeg?auto=compress&cs=tinysrgb&w=600',
  blue: 'https://images.pexels.com/photos/2097628/pexels-photo-2097628.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Sample questions in English
const englishQuestions: Question[] = [
  {
    id: '1',
    type: 'image',
    questionText: 'What animal is this?',
    imageUrl: imageUrls.dog,
    correctAnswer: 'dog',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '2',
    type: 'image',
    questionText: 'What animal is this?',
    imageUrl: imageUrls.cat,
    correctAnswer: 'cat',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '3',
    type: 'image',
    questionText: 'What animal is this?',
    imageUrl: imageUrls.elephant,
    correctAnswer: 'elephant',
    difficulty: 'medium',
    category: 'animals',
  },
  {
    id: '4',
    type: 'image',
    questionText: 'What color is this apple?',
    imageUrl: imageUrls.apple,
    correctAnswer: 'red',
    difficulty: 'easy',
    category: 'colors',
  },
  {
    id: '5',
    type: 'image',
    questionText: 'What fruit is this?',
    imageUrl: imageUrls.banana,
    correctAnswer: 'banana',
    difficulty: 'easy',
    category: 'animals',
  },
];

// Sample questions in French
const frenchQuestions: Question[] = [
  {
    id: '1',
    type: 'image',
    questionText: 'Quel animal est-ce?',
    imageUrl: imageUrls.dog,
    correctAnswer: 'chien',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '2',
    type: 'image',
    questionText: 'Quel animal est-ce?',
    imageUrl: imageUrls.cat,
    correctAnswer: 'chat',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '3',
    type: 'image',
    questionText: 'Quel animal est-ce?',
    imageUrl: imageUrls.elephant,
    correctAnswer: 'éléphant',
    difficulty: 'medium',
    category: 'animals',
  },
  {
    id: '4',
    type: 'image',
    questionText: 'Quelle couleur est cette pomme?',
    imageUrl: imageUrls.apple,
    correctAnswer: 'rouge',
    difficulty: 'easy',
    category: 'colors',
  },
  {
    id: '5',
    type: 'image',
    questionText: 'Quel fruit est-ce?',
    imageUrl: imageUrls.banana,
    correctAnswer: 'banane',
    difficulty: 'easy',
    category: 'animals',
  },
];

// Sample questions in Arabic
const arabicQuestions: Question[] = [
  {
    id: '1',
    type: 'image',
    questionText: 'ما هذا الحيوان؟',
    imageUrl: imageUrls.dog,
    correctAnswer: 'كلب',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '2',
    type: 'image',
    questionText: 'ما هذا الحيوان؟',
    imageUrl: imageUrls.cat,
    correctAnswer: 'قطة',
    difficulty: 'easy',
    category: 'animals',
  },
  {
    id: '3',
    type: 'image',
    questionText: 'ما هذا الحيوان؟',
    imageUrl: imageUrls.elephant,
    correctAnswer: 'فيل',
    difficulty: 'medium',
    category: 'animals',
  },
  {
    id: '4',
    type: 'image',
    questionText: 'ما لون هذه التفاحة؟',
    imageUrl: imageUrls.apple,
    correctAnswer: 'أحمر',
    difficulty: 'easy',
    category: 'colors',
  },
  {
    id: '5',
    type: 'image',
    questionText: 'ما هذه الفاكهة؟',
    imageUrl: imageUrls.banana,
    correctAnswer: 'موزة',
    difficulty: 'easy',
    category: 'animals',
  },
];

export async function getQuestions(language: string = 'en'): Promise<Question[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return questions based on language
  switch (language) {
    case 'fr':
      return frenchQuestions;
    case 'ar':
      return arabicQuestions;
    case 'en':
    default:
      return englishQuestions;
  }
}