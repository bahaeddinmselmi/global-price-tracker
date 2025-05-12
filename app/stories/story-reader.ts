import { EventData, Page, NavigatedData } from '@nativescript/core';
import { StoryReaderViewModel } from './story-reader-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const story = args.context?.story;
  
  if (!story) {
    // Navigate back if no story data
    page.frame.goBack();
    return;
  }
  
  page.bindingContext = new StoryReaderViewModel(story);
}