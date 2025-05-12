import { Application } from '@nativescript/core';

class ThemeManager {
  private darkMode = false;

  initializeTheme() {
    // Default to light theme
    this.setLightTheme();
  }

  toggleTheme() {
    if (this.darkMode) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  setDarkTheme() {
    this.darkMode = true;
    Application.addCss(`
      .page { background-color: #222222; }
      .title-text { color: #ffffff; }
      .subtitle-text { color: #dddddd; }
      .card { background-color: #333333; }
      .bottom-nav { background-color: #222222; border-top-color: #444444; }
      .story-text { color: #ffffff; }
      .story-page { background-color: #222222; }
    `);
  }

  setLightTheme() {
    this.darkMode = false;
    Application.addCss(`
      .page { background-color: #ffffff; }
      .title-text { color: #333333; }
      .subtitle-text { color: #666666; }
      .card { background-color: #ffffff; }
      .bottom-nav { background-color: #ffffff; border-top-color: #e5e5e5; }
      .story-text { color: #333333; }
      .story-page { background-color: #ffffff; }
    `);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}

export const themeManager = new ThemeManager();