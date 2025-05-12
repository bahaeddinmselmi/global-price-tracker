import { EventData, Page, NavigatedData } from '@nativescript/core';
import { VideoPlayerViewModel } from './video-player-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const video = args.context?.video;
  
  if (!video) {
    // Navigate back if no video data
    page.frame.goBack();
    return;
  }
  
  page.bindingContext = new VideoPlayerViewModel(video);
}