import { EventData, Page, NavigatedData } from '@nativescript/core';
import { GamesViewModel } from './games-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const unitId = args.context?.unitId;
  
  page.bindingContext = new GamesViewModel(unitId);
}