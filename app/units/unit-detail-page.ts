import { EventData, Page, NavigatedData } from '@nativescript/core';
import { UnitDetailViewModel } from './unit-detail-view-model';

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const unitId = args.context?.unitId || "unit1";
  
  page.bindingContext = new UnitDetailViewModel(unitId);
}