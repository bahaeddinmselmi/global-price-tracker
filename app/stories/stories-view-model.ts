import { Observable, Frame } from '@nativescript/core';

export class StoriesViewModel extends Observable {
  private _stories: Array<Story>;
  
  constructor() {
    super();
    this._initializeStories();
  }

  private _initializeStories() {
    // Initialize stories data
    this._stories = [
      {
        id: "story1",
        title: "Sortie à la campagne",
        description: "Elyssa, Malia, et son oiseau Nanan visitent la campagne en Tunisie.",
        coverImage: "~/assets/images/stories/campagne.png",
        hasAudio: true,
        pages: [
          {
            id: "page1",
            title: "Sortie à la campagne",
            text: "Pendant les vacances d'hiver, Elyssa visite la Tunisie. Elle fait une sortie à la campagne près du lac Ichkeul avec ses amis. Ils voient beaucoup d'animaux: une vache, un cheval, une jument, un âne, un chat, des poules, et des oiseaux roses.",
            image: "~/assets/images/stories/campagne_page1.png",
            audioFile: "~/assets/audio/stories/campagne_page1.mp3",
            animalSounds: [
              { name: "vache", sound: "~/assets/audio/animals/vache.mp3" },
              { name: "cheval", sound: "~/assets/audio/animals/cheval.mp3" },
              { name: "poule", sound: "~/assets/audio/animals/poule.mp3" }
            ]
          },
          {
            id: "page2",
            title: "L'ami de Malia",
            text: "Malia montre à ses amis son oiseau préféré. 'C'est Nanan, mon flamant rose,' dit-elle. 'Il est spécial parce qu'il a une tache noire sur son aile.' Elyssa et les autres enfants regardent Nanan avec admiration.",
            image: "~/assets/images/stories/campagne_page2.png",
            audioFile: "~/assets/audio/stories/campagne_page2.mp3",
            dialogues: [
              { speaker: "Malia", text: "C'est Nanan, mon flamant rose!" },
              { speaker: "Elyssa", text: "Il est très beau!" }
            ]
          },
          {
            id: "page3",
            title: "Où est mon oiseau !",
            text: "Le matin suivant, Malia sort de la maison et cherche son ami Nanan. Mais il n'est pas là! 'Où est mon oiseau?' crie-t-elle. Malia est très triste et commence à pleurer.",
            image: "~/assets/images/stories/campagne_page3.png",
            audioFile: "~/assets/audio/stories/campagne_page3.mp3",
            backgroundMusic: "~/assets/audio/music/sad.mp3"
          },
          {
            id: "page4",
            title: "Quelle belle surprise!",
            text: "Elyssa emmène Malia au bord du lac. Quelle surprise! Il y a beaucoup de flamants roses qui volent dans le ciel. 'Regarde, Malia! Nanan est retourné avec sa famille!' Malia est maintenant très heureuse. Elyssa montre aussi à ses amis un coq, une poule, des poussins, une chèvre, et un mouton.",
            image: "~/assets/images/stories/campagne_page4.png",
            audioFile: "~/assets/audio/stories/campagne_page4.mp3",
            animalSounds: [
              { name: "coq", sound: "~/assets/audio/animals/coq.mp3", text: "cocorico" },
              { name: "chèvre", sound: "~/assets/audio/animals/chevre.mp3", text: "bè" },
              { name: "chat", sound: "~/assets/audio/animals/chat.mp3", text: "miaou" }
            ]
          }
        ]
      },
      {
        id: "story2",
        title: "Mon premier jour d'école",
        description: "L'histoire du premier jour d'école de Malo.",
        coverImage: "~/assets/images/stories/ecole.png",
        hasAudio: true,
        pages: [
          {
            id: "page1",
            title: "Mon premier jour d'école",
            text: "Aujourd'hui, c'est le premier jour d'école pour Malo...",
            image: "~/assets/images/stories/ecole_page1.png",
            audioFile: "~/assets/audio/stories/ecole_page1.mp3"
          }
          // Additional pages would be defined here
        ]
      }
    ];
  }

  get stories(): Array<Story> {
    return this._stories;
  }

  onStoryTap(args) {
    const storyIndex = args.index;
    const selectedStory = this._stories[storyIndex];
    
    console.log(`Story tapped: ${selectedStory.title}`);
    
    // Navigate to story reader page
    Frame.topmost().navigate({
      moduleName: "stories/story-reader",
      context: { story: selectedStory },
      animated: true,
      transition: {
        name: "slide",
        duration: 300,
        curve: "easeInOut"
      }
    });
  }
}

interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  hasAudio: boolean;
  pages: Array<StoryPage>;
}

interface StoryPage {
  id: string;
  title: string;
  text: string;
  image: string;
  audioFile: string;
  dialogues?: Array<Dialogue>;
  animalSounds?: Array<AnimalSound>;
  backgroundMusic?: string;
}

interface Dialogue {
  speaker: string;
  text: string;
}

interface AnimalSound {
  name: string;
  sound: string;
  text?: string;
}