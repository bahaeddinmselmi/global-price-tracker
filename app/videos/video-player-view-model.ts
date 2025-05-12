import { Observable, Frame, Application } from '@nativescript/core';

export class VideoPlayerViewModel extends Observable {
  private _video: any;
  private _isPlaying: boolean;
  private _isMuted: boolean;
  private _showSubtitles: boolean;
  private _isFullscreen: boolean;
  private _showControls: boolean;
  private _progress: number;
  private _currentTime: string;
  private _currentSubtitle: string;
  private _showQuestion: boolean;
  private _showRecentQuestion: boolean;
  private _currentQuestion: any;
  private _progressTimer: number;

  constructor(video: any) {
    super();
    this._video = video;
    this._isPlaying = false;
    this._isMuted = false;
    this._showSubtitles = video.hasSubtitles;
    this._isFullscreen = false;
    this._showControls = true;
    this._progress = 0;
    this._currentTime = "0:00";
    this._currentSubtitle = "";
    this._showQuestion = false;
    this._showRecentQuestion = false;
    this._currentQuestion = null;
    
    // Start playing video after a delay
    setTimeout(() => {
      this._playVideo();
    }, 1000);
    
    // Hide controls after 5 seconds
    setTimeout(() => {
      this._showControls = false;
      this.notifyPropertyChange('showControls', this._showControls);
    }, 5000);
    
    // Show sample question after 10 seconds
    setTimeout(() => {
      this._showSampleQuestion();
    }, 10000);
  }

  get video(): any {
    return this._video;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get isMuted(): boolean {
    return this._isMuted;
  }

  get showSubtitles(): boolean {
    return this._showSubtitles;
  }

  get isFullscreen(): boolean {
    return this._isFullscreen;
  }

  get showControls(): boolean {
    return this._showControls;
  }

  get progress(): number {
    return this._progress;
  }

  get currentTime(): string {
    return this._currentTime;
  }

  get currentSubtitle(): string {
    return this._currentSubtitle;
  }

  get showQuestion(): boolean {
    return this._showQuestion;
  }

  get showRecentQuestion(): boolean {
    return this._showRecentQuestion;
  }

  get currentQuestion(): any {
    return this._currentQuestion;
  }

  onBackToVideos() {
    // Stop video playback
    this._stopVideo();
    
    // Navigate back to videos list
    Frame.topmost().goBack();
  }

  onTogglePlayPause() {
    if (this._isPlaying) {
      this._pauseVideo();
    } else {
      this._playVideo();
    }
    
    // Show controls
    this._showControls = true;
    this.notifyPropertyChange('showControls', this._showControls);
    
    // Hide controls after 5 seconds
    setTimeout(() => {
      this._showControls = false;
      this.notifyPropertyChange('showControls', this._showControls);
    }, 5000);
  }

  onToggleMute() {
    this._isMuted = !this._isMuted;
    this.notifyPropertyChange('isMuted', this._isMuted);
    
    console.log(`Video ${this._isMuted ? 'muted' : 'unmuted'}`);
  }

  onToggleSubtitles() {
    this._showSubtitles = !this._showSubtitles;
    this.notifyPropertyChange('showSubtitles', this._showSubtitles);
    
    console.log(`Subtitles ${this._showSubtitles ? 'enabled' : 'disabled'}`);
    
    // Show sample subtitle if enabled
    if (this._showSubtitles) {
      this._currentSubtitle = "C'est un flamant rose. Il est rose et a de longues jambes.";
      this.notifyPropertyChange('currentSubtitle', this._currentSubtitle);
    } else {
      this._currentSubtitle = "";
      this.notifyPropertyChange('currentSubtitle', this._currentSubtitle);
    }
  }

  onToggleFullscreen() {
    this._isFullscreen = !this._isFullscreen;
    this.notifyPropertyChange('isFullscreen', this._isFullscreen);
    
    console.log(`Video now in ${this._isFullscreen ? 'fullscreen' : 'normal'} mode`);
  }

  onRewind() {
    console.log("Rewinding video");
    // In a real app, this would rewind the video playback
    
    this._progress = Math.max(0, this._progress - 10);
    this.notifyPropertyChange('progress', this._progress);
    this._updateCurrentTime();
  }

  onForward() {
    console.log("Fast-forwarding video");
    // In a real app, this would fast-forward the video playback
    
    this._progress = Math.min(100, this._progress + 10);
    this.notifyPropertyChange('progress', this._progress);
    this._updateCurrentTime();
  }

  onAnswerSelected(args) {
    const optionIndex = parseInt(args.object.id.replace('option', ''));
    const selectedOption = this._currentQuestion.options[optionIndex];
    const isCorrect = selectedOption === this._currentQuestion.correctAnswer;
    
    console.log(`Selected answer: ${selectedOption}, Correct: ${isCorrect}`);
    
    // Change button color based on correctness
    if (isCorrect) {
      args.object.className = "btn-primary m-y-1";
    } else {
      args.object.className = "btn-danger m-y-1";
      
      // Find correct answer button and highlight it
      const correctOptionIndex = this._currentQuestion.options.indexOf(this._currentQuestion.correctAnswer);
      const correctOptionId = `option${correctOptionIndex}`;
      const page = Frame.topmost().currentPage;
      const correctButton = page.getViewById(correctOptionId);
      if (correctButton) {
        correctButton.className = "btn-primary m-y-1";
      }
    }
    
    // Close question after a delay
    setTimeout(() => {
      this._showQuestion = false;
      this.notifyPropertyChange('showQuestion', this._showQuestion);
      
      // Resume video playback
      this._playVideo();
      
      // Show question below player for non-fullscreen mode
      this._showRecentQuestion = true;
      this.notifyPropertyChange('showRecentQuestion', this._showRecentQuestion);
    }, 2000);
  }

  onCloseQuestion() {
    this._showQuestion = false;
    this.notifyPropertyChange('showQuestion', this._showQuestion);
    
    // Resume video playback
    this._playVideo();
  }

  private _playVideo() {
    console.log("Playing video");
    // In a real app, this would start the video playback
    
    this._isPlaying = true;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
    
    // Simulate video progress
    this._progressTimer = setInterval(() => {
      this._progress += 1;
      if (this._progress >= 100) {
        this._progress = 0;
      }
      this.notifyPropertyChange('progress', this._progress);
      
      this._updateCurrentTime();
      
      // Show sample subtitle every 20 seconds
      if (this._progress % 20 === 0 && this._showSubtitles) {
        this._updateSubtitle();
      }
    }, 1000);
  }

  private _pauseVideo() {
    console.log("Pausing video");
    // In a real app, this would pause the video playback
    
    this._isPlaying = false;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
    
    // Stop progress timer
    clearInterval(this._progressTimer);
  }

  private _stopVideo() {
    console.log("Stopping video");
    // In a real app, this would stop the video playback
    
    this._isPlaying = false;
    this.notifyPropertyChange('isPlaying', this._isPlaying);
    
    // Stop progress timer
    clearInterval(this._progressTimer);
  }

  private _updateCurrentTime() {
    // Convert progress percentage to time string (MM:SS)
    const totalSeconds = Math.floor(parseInt(this._video.duration.split(':')[0]) * 60 + parseInt(this._video.duration.split(':')[1])) * (this._progress / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    this._currentTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    this.notifyPropertyChange('currentTime', this._currentTime);
  }

  private _updateSubtitle() {
    // Sample subtitles
    const subtitles = [
      "Bonjour les enfants!",
      "Regardez le flamant rose.",
      "Il est grand et rose.",
      "Les flamants roses vivent près des lacs.",
      "Ils mangent de petits animaux dans l'eau."
    ];
    
    this._currentSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
    this.notifyPropertyChange('currentSubtitle', this._currentSubtitle);
    
    // Clear subtitle after 5 seconds
    setTimeout(() => {
      this._currentSubtitle = "";
      this.notifyPropertyChange('currentSubtitle', this._currentSubtitle);
    }, 5000);
  }

  private _showSampleQuestion() {
    if (this._video.questions && this._video.questions.length > 0) {
      // Pause video
      this._pauseVideo();
      
      // Show question
      this._currentQuestion = this._video.questions[0];
      this._showQuestion = true;
      this.notifyPropertyChange('currentQuestion', this._currentQuestion);
      this.notifyPropertyChange('showQuestion', this._showQuestion);
    }
  }
}