import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { SolutionsGrabberService } from '../solutions-grabber.service';

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})

export class ControlPanelComponent implements OnInit, OnDestroy {
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

  remainingSolutionsSub: Subscription;
  allPiecesUsedSub: Subscription;
  currentSolutionNumberSub: Subscription;

  controlButtonsForm: FormGroup;

  @HostBinding('style.margin') margin;
  @HostBinding('style.height') height;


  constructor(
    private bankCircleConnectorService: BankCircleConnectorService,
    private solutionsGrabberService: SolutionsGrabberService
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

    //note: the values of the toggle controls are inverted
    //they display opposite message of what's currently shown.
    //will be needed when saving user preferences into local storage
    this.controlButtonsForm = new FormGroup({
      'patternNameDropdown': new FormControl("Planets"),
      'toggleLetters': new FormControl("Toggle Letters Off"),
      'autoOpenEnabled': new FormControl("Disable Auto Open"),
      'showAllSolutions': new FormControl(true),
      'solutionNumberDropdown': new FormControl('Solutions:'),
      'toggleSolutionsPanel': new FormControl("Reveal Solutions Panel")  //"{{displaySolutionsPanel ? 'Hide' : 'Reveal'}} Solutions Panel"
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

  generateSolutions() {
    const numberOfSolutions = this.solutionsGrabberService.startGeneratingSolutions();
    this.numberOfSolutions = numberOfSolutions;
    this.numberOfSolutionsArray = new Array(numberOfSolutions);
    for (let i = 0; i < numberOfSolutions; i++) {
      this.numberOfSolutionsArray[i] = i;
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

    let j = 0;
    for (let i = startOption; i <= endOption; i++) {
      this.numberOfSolutionsArray[j] = i;
      j++;
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
    //reset soln picker to default
    this.controlButtonsForm.patchValue({
      solutionNumberDropdown: 'Solutions:',
      showAllSolutions: true
    });
  }

  onToggleSolutionsPanel() {
    this.displaySolutionsPanel = !this.displaySolutionsPanel;
    this.controlButtonsForm.patchValue({
      toggleSolutionsPanel: this.displaySolutionsPanel ? "Hide Solutions Panel" : "Reveal Solutions Panel",
    });
  }

  ngOnDestroy() {
    if (this.remainingSolutionsSub) this.remainingSolutionsSub.unsubscribe();
    if (this.allPiecesUsedSub) this.allPiecesUsedSub.unsubscribe();
    if (this.currentSolutionNumberSub) this.currentSolutionNumberSub.unsubscribe();
  }
}
