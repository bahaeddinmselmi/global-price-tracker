import { Observable, Frame } from '@nativescript/core';

export class UnitsViewModel extends Observable {
  constructor() {
    super();
  }

  onUnitTap(args) {
    const unitId = args.object.id;
    console.log(`Unit tapped: ${unitId}`);
    
    // Navigate to unit detail page
    Frame.topmost().navigate({
      moduleName: "units/unit-detail-page",
      context: { unitId: unitId },
      animated: true,
      transition: {
        name: "slide",
        duration: 300,
        curve: "easeInOut"
      }
    });
  }
}