import { EventData, Page, NavigatedData } from '@nativescript/core';
import { StoriesViewModel } from './stories-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new StoriesViewModel();
}