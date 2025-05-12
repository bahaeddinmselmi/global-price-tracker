import { Observable, Frame } from '@nativescript/core';

export class QuizViewModel extends Observable {
  private _quiz: any;
  private _currentQuestionIndex: number;
  private _userAnswer: string;
  private _showFeedback: boolean;
  private _isCorrect: boolean;
  private _feedbackMessage: string;

  constructor(quiz: any) {
    super();
    this._quiz = quiz;
    this._currentQuestionIndex = 0;
    this._userAnswer = "";
    this._showFeedback = false;
    this._isCorrect = false;
    this._feedbackMessage = "";
  }

  get quiz(): any {
    return this._quiz;
  }

  get currentQuestionIndex(): number {
    return this._currentQuestionIndex;
  }

  get currentQuestion(): any {
    return this._quiz.questions[this._currentQuestionIndex];
  }

  get userAnswer(): string {
    return this._userAnswer;
  }

  set userAnswer(value: string) {
    if (this._userAnswer !== value) {
      this._userAnswer = value;
      this.notifyPropertyChange('userAnswer', value);
    }
  }

  get showFeedback(): boolean {
    return this._showFeedback;
  }

  get isCorrect(): boolean {
    return this._isCorrect;
  }

  get feedbackMessage(): string {
    return this._feedbackMessage;
  }

  get isLastQuestion(): boolean {
    return this._currentQuestionIndex === this._quiz.questions.length - 1;
  }

  onPlayAudio() {
    console.log("Playing audio...");
    // Play the audio associated with the current question
    // This would use nativescript-audio in a real implementation
  }

  onStartSpeechRecognition() {
    console.log("Starting speech recognition...");
    // This would use a speech recognition plugin in a real implementation
    
    // For demo purposes, simulate speech recognition
    setTimeout(() => {
      this.userAnswer = "Je vais à la campagne";
    }, 2000);
  }

  onImageSelected(args) {
    const image = args.object;
    const imageName = image.src.split('/').pop();
    
    console.log(`Selected image: ${imageName}`);
    this.userAnswer = imageName;
    
    // Show visual feedback for selection
    image.animate({
      scale: { x: 1.1, y: 1.1 },
      duration: 200
    }).then(() => {
      return image.animate({
        scale: { x: 1.0, y: 1.0 },
        duration: 200
      });
    });
  }

  onOptionSelected(args) {
    const option = args.object.text;
    this.userAnswer = option;
  }

  onCheck() {
    const correctAnswer = this.currentQuestion.correctAnswer.toLowerCase();
    const userAnswer = this.userAnswer.toLowerCase();
    
    // Check if answer is correct (simple string comparison for demo)
    this._isCorrect = userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
    
    // Set feedback message
    if (this._isCorrect) {
      this._feedbackMessage = "Excellente réponse!";
    } else {
      this._feedbackMessage = `La bonne réponse est: ${this.currentQuestion.correctAnswer}`;
    }
    
    // Show feedback
    this._showFeedback = true;
    this.notifyPropertyChange('isCorrect', this._isCorrect);
    this.notifyPropertyChange('feedbackMessage', this._feedbackMessage);
    this.notifyPropertyChange('showFeedback', this._showFeedback);
  }

  onNext() {
    // Move to next question or finish quiz
    if (this.isLastQuestion) {
      // Navigate to results page
      Frame.topmost().navigate({
        moduleName: "games/quiz-results",
        context: { quiz: this._quiz },
        animated: true
      });
    } else {
      // Move to next question
      this._currentQuestionIndex++;
      this._userAnswer = "";
      this._showFeedback = false;
      
      // Update observables
      this.notifyPropertyChange('currentQuestionIndex', this._currentQuestionIndex);
      this.notifyPropertyChange('currentQuestion', this.currentQuestion);
      this.notifyPropertyChange('userAnswer', this._userAnswer);
      this.notifyPropertyChange('showFeedback', this._showFeedback);
    }
  }
}