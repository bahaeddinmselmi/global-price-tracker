import { Observable, Frame } from '@nativescript/core';

export class UnitDetailViewModel extends Observable {
  private _unitId: string;
  private _unitTitle: string;
  private _unitDescription: string;
  private _unitImage: string;
  private _activities: Array<Activity>;

  constructor(unitId: string) {
    super();
    this._unitId = unitId;
    this._initializeUnitData();
  }

  private _initializeUnitData() {
    // Initialize unit data based on unitId
    switch (this._unitId) {
      case "unit1":
        this._unitTitle = "Ma famille, mon amour!";
        this._unitDescription = "Découvrez le vocabulaire lié à la famille, les relations familiales, et comment parler de votre famille en français.";
        this._unitImage = "~/assets/images/units/family.png";
        break;
      case "unit2":
        this._unitTitle = "Mon école";
        this._unitDescription = "Apprenez le vocabulaire de l'école, les matières scolaires, et comment parler de vos activités à l'école.";
        this._unitImage = "~/assets/images/units/school.png";
        break;
      case "unit3":
        this._unitTitle = "Mon corps";
        this._unitDescription = "Découvrez les parties du corps, les sens, et comment exprimer ce que vous ressentez.";
        this._unitImage = "~/assets/images/units/body.png";
        break;
      case "unit4":
        this._unitTitle = "Dans mon assiette!";
        this._unitDescription = "Apprenez le vocabulaire de la nourriture, des repas, et comment parler de vos goûts alimentaires.";
        this._unitImage = "~/assets/images/units/food.png";
        break;
      case "unit5":
        this._unitTitle = "Mes amis, les animaux";
        this._unitDescription = "Découvrez les animaux domestiques et sauvages, leurs habitats, et les sons qu'ils font.";
        this._unitImage = "~/assets/images/units/animals.png";
        break;
      default:
        this._unitTitle = "Unité";
        this._unitDescription = "Explorez cette unité d'apprentissage.";
        this._unitImage = "~/assets/images/units/default.png";
    }

    // Create sample activities for each unit
    this._activities = [
      {
        id: 1,
        title: "Vocabulaire",
        description: "Apprendre les mots essentiels de cette unité."
      },
      {
        id: 2,
        title: "Écoute",
        description: "Écoutez des dialogues et des histoires liés à cette unité."
      },
      {
        id: 3,
        title: "Parle",
        description: "Pratiquez votre prononciation et votre expression orale."
      },
      {
        id: 4,
        title: "Joue",
        description: "Jouez à des jeux éducatifs pour renforcer votre apprentissage."
      }
    ];
  }

  get unitTitle(): string {
    return this._unitTitle;
  }

  get unitDescription(): string {
    return this._unitDescription;
  }

  get unitImage(): string {
    return this._unitImage;
  }

  get activities(): Array<Activity> {
    return this._activities;
  }

  onStartLearning() {
    console.log(`Start learning unit: ${this._unitId}`);
    // Navigate to learning content
    Frame.topmost().navigate({
      moduleName: "units/learning-page",
      context: { unitId: this._unitId },
      animated: true
    });
  }

  onStartExercises() {
    console.log(`Start exercises for unit: ${this._unitId}`);
    // Navigate to exercises
    Frame.topmost().navigate({
      moduleName: "games/games-page",
      context: { unitId: this._unitId },
      animated: true
    });
  }
}

interface Activity {
  id: number;
  title: string;
  description: string;
}