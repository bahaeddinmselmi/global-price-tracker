import { EventData, Page, NavigatedData } from '@nativescript/core';
import { VideosViewModel } from './videos-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new VideosViewModel();
}