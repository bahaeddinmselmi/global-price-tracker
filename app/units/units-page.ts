import { EventData, Page, NavigatedData } from '@nativescript/core';
import { UnitsViewModel } from './units-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new UnitsViewModel();
}