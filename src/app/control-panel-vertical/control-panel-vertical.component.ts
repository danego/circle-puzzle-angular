import { Component, OnInit, OnDestroy, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { SolutionsGrabberService } from '../solutions-grabber.service';
import { PieceSizingService } from '../piece-sizing.service';
import { SizingDataInterface } from '../sizing-data.interface';

@Component({
  selector: 'control-panel-vertical',
  templateUrl: './control-panel-vertical.component.html',
  styleUrls: ['./control-panel-vertical.component.css']
})

export class ControlPanelVerticalComponent implements OnInit, OnDestroy {
  numberOfSolutionsArray: any[] = [];
  numberOfSolutions: number;
  remainingSolutions: number = 0;
  allPiecesUsed: boolean = false;
  displaySolutionsPanel: boolean = false;
  limitSolutionsShown: boolean = false;
  currentSolutionNumber: number;
  currentPattern: string = 'Planets';
  displayColorLetters: boolean = true;
  autoOpenEnabled: boolean = true;
  scrollZonesEnabled: boolean = true;
  pieceSizes: SizingDataInterface;

  remainingSolutionsSub: Subscription;
  allPiecesUsedSub: Subscription;
  currentSolutionNumberSub: Subscription;
  pieceSizesSub: Subscription;

  controlButtonsForm: UntypedFormGroup;

  @Input('currentLayout') currentLayout: string;

  @HostBinding('style.margin') margin;
  @HostBinding('style.height') height;

  constructor(
    private bankCircleConnectorService: BankCircleConnectorService,
    private solutionsGrabberService: SolutionsGrabberService,
    private pieceSizingService: PieceSizingService
  ) { }

   ngOnInit() {
    this.remainingSolutionsSub = this.solutionsGrabberService.remainingSolutions.subscribe((remainingSolutions) => {
      this.remainingSolutions = remainingSolutions;
    });

    this.allPiecesUsedSub = this.solutionsGrabberService.allPiecesUsedSubject.subscribe((allPiecesUsed) => {
      this.allPiecesUsed = allPiecesUsed;
    });

    this.currentSolutionNumberSub = this.solutionsGrabberService.currentSolutionNumber.subscribe((solnNumber) => {
      this.currentSolutionNumber = solnNumber;
    });

    // implicitly gets height for control panel
    this.pieceSizesSub = this.pieceSizingService.pieceSizes.subscribe(pieceSizesData => {
      this.pieceSizes = pieceSizesData;
      //containerSize accessed from pieceSizes in HTML
    });

    //set placeholder value depending on ng-select or default select used
    let solutionDropdownPlaceholder = this.determinePlaceholderValue();

    //note: the values of the toggle controls are inverted
    //they display opposite message of what's currently shown.
    //will be needed when saving user preferences into local storage
    this.controlButtonsForm = new UntypedFormGroup({
      'patternNameDropdown': new UntypedFormControl("Planets"),
      'autoOpenEnabled': new UntypedFormControl("Disable Auto Open"),
      'scrollZonesEnabled': new UntypedFormControl("Hide Scroll Zones"),
      'toggleLetters': new UntypedFormControl("Toggle Letters Off"),
      'showAllSolutions': new UntypedFormControl('true'),
      'solutionNumberDropdown': new UntypedFormControl(solutionDropdownPlaceholder),
      'toggleSolutionsPanel': new UntypedFormControl("Reveal Solutions Panel")  //"{{displaySolutionsPanel ? 'Hide' : 'Reveal'}} Solutions Panel"
    });

    this.generateSolutions();
  }

  moveAllToBank() {
    this.bankCircleConnectorService.transferAllToBank();
  }

  moveAllToCircle(solutionNumber?: number) {
    if (solutionNumber || solutionNumber === 0) {
      this.bankCircleConnectorService.transferAllToCircle(solutionNumber);
    }
    else {
      this.bankCircleConnectorService.transferAllToCircle();
    }
  }

  onToggleColorLetters() {
    this.displayColorLetters = !this.displayColorLetters;
    this.bankCircleConnectorService.toggleColorLetters(this.displayColorLetters);
    this.controlButtonsForm.get('toggleLetters').patchValue(
      this.displayColorLetters ? "Toggle Letters Off" : "Toggle Letters On"
    );
  }

  //mobile only because of touch events
  onToggleAutoOpen() {
    this.autoOpenEnabled = !this.autoOpenEnabled;
    this.bankCircleConnectorService.toggleAutoOpen(this.autoOpenEnabled);
    this.controlButtonsForm.get('autoOpenEnabled').patchValue(
      this.autoOpenEnabled ? "Disable Auto Open" : "Enable Auto Open"
    );
  }

  enableScrollZones() {
    this.scrollZonesEnabled = !this.scrollZonesEnabled;
    this.bankCircleConnectorService.toggleScrollZones(this.scrollZonesEnabled);
    this.controlButtonsForm.get('scrollZonesEnabled').patchValue(
      this.scrollZonesEnabled ? "Hide Scroll Zones" : "Show Scroll Zones"
    );
  }
  

  generateSolutions() {
    const numberOfSolutions = this.solutionsGrabberService.startGeneratingSolutions();
    this.numberOfSolutions = numberOfSolutions;
    this.numberOfSolutionsArray = new Array(numberOfSolutions);

    //default select takes primitives 
    //ng-select takes object to display diff value when selected
    if (this.currentLayout === 'layout-vertical') {
      for (let i = 0; i < numberOfSolutions; i++) {
        this.numberOfSolutionsArray[i] = i;
      }
    }
    else {
      for (let i = 0; i < numberOfSolutions; i++) {
        this.numberOfSolutionsArray[i] = {
          number: i,
          value: 'Solution: ' + i
        };
      }
    }
  }

  generateLimitedSolutions(dropdownValue?: number) {
    if (!dropdownValue) dropdownValue = 0;

    this.numberOfSolutionsArray = new Array(11);

    let startOption, endOption;
    if (dropdownValue - 5 < 0) {
      startOption = 0;
      endOption = 10;
    }
    else if (dropdownValue + 5 > this.numberOfSolutions - 1){
      startOption = this.numberOfSolutions - 11;
      endOption = this.numberOfSolutions - 1;
    }
    else {
      startOption = dropdownValue - 5;
      endOption = dropdownValue + 5;
    }

    //default select takes primitives 
    //ng-select takes object to display diff value when selected
    let j = 0;
    if (this.currentLayout === 'layout-vertical') {
      for (let i = startOption; i <= endOption; i++) {
        this.numberOfSolutionsArray[j] = i;
        j++;
      }
    }
    else {
      for (let i = startOption; i <= endOption; i++) {
        this.numberOfSolutionsArray[j] = {
          number: i,
          value: 'Solution: ' + i
        };
        j++;
      }
    }
  }

  onSlideChange(event) {
    this.limitSolutionsShown = !event.checked;
    const dropdownValue: number = +this.controlButtonsForm.get('solutionNumberDropdown').value;
  
    if (this.limitSolutionsShown) {
      this.generateLimitedSolutions(dropdownValue);
    }
    else {
      this.generateSolutions();
    }
  }
  
  //event value is custom from ng-select so no event.target.value
  onLoadNewSolution(optionData) {
    const solutionNumber = optionData.number;
    this.moveAllToCircle(solutionNumber);
  }

  onLoadNewSolutionMobile(solutionNumber: number) {
    this.controlButtonsForm.value;
    this.moveAllToCircle(solutionNumber);
  }

  //event value is custom from ng-select so no event.target.value
  onLoadNewPattern(patternName) {
    this.solutionsGrabberService.changeCurrentPattern(patternName.toLowerCase());
    this.moveAllToCircle();
    this.currentPattern = patternName;
    this.generateSolutions();

    //reset soln picker to placeholder text; slideToggle to show all
    let solutionDropdownPlaceholder = this.determinePlaceholderValue();
    this.controlButtonsForm.patchValue({
      solutionNumberDropdown: solutionDropdownPlaceholder,
      showAllSolutions: true
    });
  }

  onToggleSolutionsPanel() {
    this.displaySolutionsPanel = !this.displaySolutionsPanel;
    this.controlButtonsForm.patchValue({
      toggleSolutionsPanel: this.displaySolutionsPanel ? "Hide Solutions Panel" : "Reveal Solutions Panel",
    });
  }

  //set placeholder value depending on ng-select or default select used
  determinePlaceholderValue() {
    let solutionDropdownPlaceholder;
    if (this.currentLayout === 'layout-vertical') {
      solutionDropdownPlaceholder = 'Solutions:';
    }
    else {
      solutionDropdownPlaceholder = null;
    }
    return solutionDropdownPlaceholder;
  }

  ngOnDestroy() {
    if (this.remainingSolutionsSub) this.remainingSolutionsSub.unsubscribe();
    if (this.allPiecesUsedSub) this.allPiecesUsedSub.unsubscribe();
    if (this.currentSolutionNumberSub) this.currentSolutionNumberSub.unsubscribe();
    if (this.pieceSizesSub) this.pieceSizesSub.unsubscribe();
  }
}
