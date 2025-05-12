import { Application } from '@nativescript/core';
import { themeManager } from './shared/theme-manager';

// Initialize theme
themeManager.initializeTheme();

Application.run({ moduleName: 'app-root' });