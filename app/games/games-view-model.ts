import { Observable, Frame } from '@nativescript/core';

export class GamesViewModel extends Observable {
  private _quizzes: Array<Quiz>;
  
  constructor(unitId?: string) {
    super();
    this._initializeQuizzes(unitId);
  }

  private _initializeQuizzes(unitId?: string) {
    // Initialize quizzes data
    this._quizzes = [
      {
        id: "quiz1",
        title: "Quiz campagne",
        description: "Questions sur la sortie à la campagne",
        level: "Facile",
        icon: "~/assets/images/games/quiz1.png",
        questions: [
          {
            id: "q1",
            text: "Où va-t-elle la famille pendant les vacances d'hiver ?",
            type: "speech",
            options: [],
            correctAnswer: "campagne"
          },
          {
            id: "q2",
            text: "J'écoute et je complète: Dans la campagne, les enfants voient des animaux. Ils voient...",
            type: "audio",
            audioClips: ["a1.mp3", "a2.mp3", "a3.mp3", "a4.mp3", "a5.mp3", "a6.mp3"],
            options: [],
            correctAnswer: "des flamants roses"
          },
          {
            id: "q3",
            text: "Quand est ce que Malia sort de la maison ?",
            type: "speech",
            options: [],
            correctAnswer: "matin"
          },
          {
            id: "q4",
            text: "Pourquoi Malia est triste ?",
            type: "text",
            options: [],
            correctAnswer: "son oiseau est parti"
          }
        ]
      },
      {
        id: "quiz2",
        title: "Les animaux",
        description: "Apprendre les noms des animaux",
        level: "Moyen",
        icon: "~/assets/images/games/quiz2.png",
        questions: [
          {
            id: "q1",
            text: "Quel est l'ami de Malia ?",
            type: "image",
            options: ["flamingo.png", "cow.png", "horse.png", "chicken.png"],
            correctAnswer: "flamingo.png"
          },
          {
            id: "q2",
            text: "Quel son fait le coq ?",
            type: "audio",
            audioClips: ["coq.mp3", "vache.mp3", "cheval.mp3"],
            options: ["Cocorico", "Meuh", "Hiiiii"],
            correctAnswer: "Cocorico"
          }
        ]
      },
      {
        id: "quiz3",
        title: "Vocabulaire",
        description: "Apprendre de nouveaux mots",
        level: "Difficile",
        icon: "~/assets/images/games/quiz3.png",
        questions: [
          {
            id: "q1",
            text: "Comment s'appelle le flamant rose de Malia ?",
            type: "text",
            options: [],
            correctAnswer: "Nanan"
          }
        ]
      }
    ];
    
    // If unitId is provided, filter quizzes based on the unit
    if (unitId) {
      // For demonstration, we're not filtering here, but you would in a real app
      console.log(`Loading quizzes for unit: ${unitId}`);
    }
  }

  get quizzes(): Array<Quiz> {
    return this._quizzes;
  }

  onQuizTap(args) {
    const quizIndex = args.index;
    const selectedQuiz = this._quizzes[quizIndex];
    
    console.log(`Quiz tapped: ${selectedQuiz.title}`);
    
    // Navigate to quiz page
    Frame.topmost().navigate({
      moduleName: "games/quiz-page",
      context: { quiz: selectedQuiz },
      animated: true,
      transition: {
        name: "slide",
        duration: 300,
        curve: "easeInOut"
      }
    });
  }
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  level: string;
  icon: string;
  questions: Array<Question>;
}

interface Question {
  id: string;
  text: string;
  type: "text" | "speech" | "audio" | "image";
  options: Array<string>;
  audioClips?: Array<string>;
  correctAnswer: string;
}