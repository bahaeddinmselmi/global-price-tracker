import { Observable, Frame, Application } from '@nativescript/core';

export class StoryReaderViewModel extends Observable {
  private _story: any;
  private _currentPageIndex: number;
  private _isPlaying: boolean;
  private _showQuizPrompt: boolean;
  private _quizPrompt: string;

  constructor(story: any) {
    super();
    this._story = story;
    this._currentPageIndex = 0;
    this._isPlaying = false;
    this._showQuizPrompt = false;
    this._quizPrompt = "";
    
    // Start playing audio when page loads
    this._playAudio();
  }

  get story(): any {
    return this._story;
  }

  get currentPageIndex(): number {
    return this._currentPageIndex;
  }

  get currentPage(): any {
    return this._story.pages[this._currentPageIndex];
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get showQuizPrompt(): boolean {
    return this._showQuizPrompt;
  }

  get quizPrompt(): string {
    return this._quizPrompt;
  }

  onBackToStories() {
    // Stop audio before navigating
    this._stopAudio();
    
    // Navigate back to stories list
    Frame.topmost().goBack();
  }

  onPreviousPage() {
    if (this._currentPageIndex > 0) {
      // Stop current audio
      this._stopAudio();
      
      // Go to previous page
      this._currentPageIndex--;
      this.notifyPropertyChange('currentPageIndex', this._currentPageIndex);
      this.notifyPropertyChange('currentPage', this.currentPage);
      
      // Start playing audio for new page
      this._playAudio();
      
      // Hide quiz prompt
      this._showQuizPrompt = false;
      this.notifyPropertyChange('showQuizPrompt', this._showQuizPrompt);
    }
  }

  onNextPage() {
    if (this._currentPageIndex < this._story.pages.length - 1) {
      // Stop current audio
      this._stopAudio();
      
      // Go to next page
      this._currentPageIndex++;
      this.notifyPropertyChange('currentPageIndex', this._currentPageIndex);
      this.notifyPropertyChange('currentPage', this.currentPage);
      
      // Start playing audio for new page
      this._playAudio();
      
      // Show quiz prompt with 30% probability
      if (Math.random() < 0.3) {
        this._showQuizPrompt = true;
        this._setRandomQuizPrompt();
        this.notifyPropertyChange('showQuizPrompt', this._showQuizPrompt);
        this.notifyPropertyChange('quizPrompt', this._quizPrompt);
      } else {
        this._showQuizPrompt = false;
        this.notifyPropertyChange('showQuizPrompt', this._showQuizPrompt);
      }
    } else {
      // This is the last page, go back to stories list
      this._stopAudio();
      Frame.topmost().navigate({
        moduleName: "stories/stories-page",
        animated: true,
        transition: {
          name: "slideRight",
          duration: 300,
          curve: "easeInOut"
        }
      });
    }
  }

  onToggleAudio() {
    if (this._isPlaying) {
      this._pauseAudio();
    } else {
      this._playAudio();
    }
  }

  onAnimalTap(args) {
    const animalId = args.object.id;
    console.log(`Animal tapped: ${animalId}`);
    
    // Find the animal sound in the current page
    if (this.currentPage.animalSounds) {
      const animalSound = this.currentPage.animalSounds.find(sound => sound.name === animalId);
      if (animalSound) {
        // Play animal sound
        console.log(`Playing sound: ${animalSound.sound}`);
        // In a real app, you would use nativescript-audio to play the sound
      }
    }
    
    // Animate the tapped animal
    args.object.animate({
      scale: { x: 1.2, y: 1.2 },
      duration: 200
    }).then(() => {
      return args.object.animate({
        scale: { x: 1.0, y: 1.0 },
        duration: 200
      });
    });
  }

  onAnimalSoundButton(args) {
    const animalId = args.object.id;
    console.log(`Animal sound button tapped: ${animalId}`);
    
    // Find the animal sound in the current page
    if (this.currentPage.animalSounds) {
      const animalSound = this.currentPage.animalSounds.find(sound => sound.name === animalId);
      if (animalSound) {
        // Play animal sound
        console.log(`Playing sound: ${animalSound.sound}`);
        // In a real app, you would use nativescript-audio to play the sound
      }
    }
  }

  onFlamingoCutscene() {
    console.log("Flamingo cutscene triggered");
    
    // In a real app, this would trigger an animation or cutscene
    // For now, we'll just show a quiz prompt
    this._showQuizPrompt = true;
    this._quizPrompt = "Quel animal est rose?";
    this.notifyPropertyChange('showQuizPrompt', this._showQuizPrompt);
    this.notifyPropertyChange('quizPrompt', this._quizPrompt);
  }

  onDialogueTap(args) {
    console.log("Dialogue tapped");
    
    // In a real app, this might highlight the dialogue or play its audio
  }

  private _playAudio() {
    console.log(`Playing audio: ${this.currentPage.audioFile}`);
    // In a real app, you would use nativescript-audio to play the audio
    this._isPlaying = true;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
  }

  private _pauseAudio() {
    console.log("Pausing audio");
    // In a real app, you would pause the audio playback
    this._isPlaying = false;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
  }

  private _stopAudio() {
    console.log("Stopping audio");
    // In a real app, you would stop the audio playback
    this._isPlaying = false;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
  }

  private _setRandomQuizPrompt() {
    // Set a random quiz prompt based on the current page
    const prompts = [
      "Que fait Malia?",
      "Quel animal est rose?",
      "Pourquoi Malia est triste?",
      "Où sont les enfants?"
    ];
    
    this._quizPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  }
}