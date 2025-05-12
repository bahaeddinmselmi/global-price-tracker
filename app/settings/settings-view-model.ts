import { Observable, Frame } from '@nativescript/core';
import { themeManager } from '../shared/theme-manager';

export class SettingsViewModel extends Observable {
  private _volume: number;
  private _isDarkMode: boolean;
  private _parentalControlEnabled: boolean;

  constructor() {
    super();
    this._volume = 80;
    this._isDarkMode = themeManager.isDarkMode();
    this._parentalControlEnabled = false;
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    if (this._volume !== value) {
      this._volume = value;
      this.notifyPropertyChange('volume', value);
      console.log(`Volume set to: ${value}`);
    }
  }

  get isDarkMode(): boolean {
    return this._isDarkMode;
  }

  set isDarkMode(value: boolean) {
    if (this._isDarkMode !== value) {
      this._isDarkMode = value;
      this.notifyPropertyChange('isDarkMode', value);
      
      // Update theme
      if (value) {
        themeManager.setDarkTheme();
      } else {
        themeManager.setLightTheme();
      }
      
      console.log(`Dark mode: ${value}`);
    }
  }

  get parentalControlEnabled(): boolean {
    return this._parentalControlEnabled;
  }

  set parentalControlEnabled(value: boolean) {
    if (this._parentalControlEnabled !== value) {
      this._parentalControlEnabled = value;
      this.notifyPropertyChange('parentalControlEnabled', value);
      console.log(`Parental control: ${value}`);
    }
  }

  onAboutTap() {
    console.log("About tapped");
    // Navigate to about page
    Frame.topmost().navigate({
      moduleName: "settings/about-page",
      animated: true
    });
  }
}