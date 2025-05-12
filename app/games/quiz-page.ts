import { EventData, Page, NavigatedData } from '@nativescript/core';
import { QuizViewModel } from './quiz-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const quiz = args.context?.quiz;
  
  if (!quiz) {
    // Navigate back if no quiz data
    page.frame.goBack();
    return;
  }
  
  page.bindingContext = new QuizViewModel(quiz);
}