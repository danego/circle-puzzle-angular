import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { SolutionsGrabberService } from '../solutions-grabber.service';

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})

export class ControlPanelComponent implements OnInit, OnDestroy {
  numberOfSolutionsArray: any[] = [];
  remainingSolutions: number = 0;
  allPiecesUsed: boolean = false;
  displaySolutionsPanel: boolean = false;
  limitSolutionsShown: boolean = false;
  currentSolutionNumber: number;
  displayColorLetters: boolean = true;

  remainingSolutionsSub: Subscription;
  allPiecesUsedSub: Subscription;
  currentSolutionNumberSub: Subscription;

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

    this.onGenerateSolutions();
  }

  moveAllToBank() {
    this.bankCircleConnectorService.transferAllToBank();
  }

  moveAllToCircle() {
    this.bankCircleConnectorService.transferAllToCircle();
  }

  onToggleColorLetters() {
    this.displayColorLetters = !this.displayColorLetters;
    this.bankCircleConnectorService.toggleColorLetters(this.displayColorLetters);
  }

  onGenerateSolutions() {
    const numberOfSolutions = this.solutionsGrabberService.startGeneratingSolutions();
    this.numberOfSolutionsArray = new Array(numberOfSolutions);
  }

  onSlideChange(event) {
    this.limitSolutionsShown = !event.checked;

    if (this.limitSolutionsShown) {
      this.numberOfSolutionsArray = new Array(11);
    }
    else {
      this.onGenerateSolutions();
    }
  }
  
  onLoadNewSolution(event) {
    const newSolutionNumber = event.target.value;
    this.bankCircleConnectorService.transferAllToCircle(newSolutionNumber);
  }

  ngOnDestroy() {
    this.remainingSolutionsSub.unsubscribe();
    this.allPiecesUsedSub.unsubscribe();
    this.currentSolutionNumberSub.unsubscribe();
  }
}
