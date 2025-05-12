import { Observable } from '@nativescript/core';
import { Page } from '@nativescript/core';

export function navigatingTo(args) {
  const page = args.object as Page;
  page.bindingContext = new TabsViewModel();
}

export class TabsViewModel extends Observable {
  private _selectedTabIndex: number;

  constructor() {
    super();
    this._selectedTabIndex = 0;
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  set selectedTabIndex(value: number) {
    if (this._selectedTabIndex !== value) {
      this._selectedTabIndex = value;
      this.notifyPropertyChange('selectedTabIndex', value);
    }
  }
}