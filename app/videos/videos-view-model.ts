import { Observable, Frame } from '@nativescript/core';

export class VideosViewModel extends Observable {
  private _videos: Array<Video>;
  
  constructor() {
    super();
    this._initializeVideos();
  }

  private _initializeVideos() {
    // Initialize videos data
    this._videos = [
      {
        id: "video1",
        title: "Les animaux de la ferme",
        description: "Apprenez les noms des animaux de la ferme et les sons qu'ils font.",
        thumbnail: "~/assets/images/videos/farm_animals.png",
        videoUrl: "https://example.com/videos/farm_animals.mp4",
        duration: "3:45",
        hasSubtitles: true,
        questions: [
          {
            id: "q1",
            text: "Quel animal fait 'meuh'?",
            timeToShow: 60, // seconds into the video
            options: ["La vache", "Le mouton", "Le chien"],
            correctAnswer: "La vache"
          }
        ]
      },
      {
        id: "video2",
        title: "Les couleurs",
        description: "Apprenez les noms des couleurs en français.",
        thumbnail: "~/assets/images/videos/colors.png",
        videoUrl: "https://example.com/videos/colors.mp4",
        duration: "2:30",
        hasSubtitles: true,
        questions: [
          {
            id: "q1",
            text: "Quelle est la couleur du ciel?",
            timeToShow: 45, // seconds into the video
            options: ["Bleu", "Rouge", "Vert"],
            correctAnswer: "Bleu"
          }
        ]
      },
      {
        id: "video3",
        title: "Ma famille",
        description: "Apprenez les mots pour décrire les membres de la famille.",
        thumbnail: "~/assets/images/videos/family.png",
        videoUrl: "https://example.com/videos/family.mp4",
        duration: "4:15",
        hasSubtitles: false,
        questions: [
          {
            id: "q1",
            text: "Comment s'appelle la mère de ton père?",
            timeToShow: 120, // seconds into the video
            options: ["Ta grand-mère", "Ta tante", "Ta mère"],
            correctAnswer: "Ta grand-mère"
          }
        ]
      }
    ];
  }

  get videos(): Array<Video> {
    return this._videos;
  }

  onVideoTap(args) {
    const videoIndex = args.index;
    const selectedVideo = this._videos[videoIndex];
    
    console.log(`Video tapped: ${selectedVideo.title}`);
    
    // Navigate to video player page
    Frame.topmost().navigate({
      moduleName: "videos/video-player",
      context: { video: selectedVideo },
      animated: true,
      transition: {
        name: "slide",
        duration: 300,
        curve: "easeInOut"
      }
    });
  }
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  hasSubtitles: boolean;
  questions: Array<VideoQuestion>;
}

interface VideoQuestion {
  id: string;
  text: string;
  timeToShow: number;
  options: Array<string>;
  correctAnswer: string;
}