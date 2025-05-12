import { EventData, Page, NavigatedData } from '@nativescript/core';
import { SettingsViewModel } from './settings-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new SettingsViewModel();
}