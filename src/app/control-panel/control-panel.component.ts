import { Component, OnInit } from '@angular/core';

import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { SolutionsGrabberService } from '../solutions-grabber.service';

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})

export class ControlPanelComponent implements OnInit {
  numberOfSolutionsArray: any[] = [];
  remainingSolutions: number = 0;
  allPiecesUsed: boolean = false;
  currentSolutionNumber: number;

  constructor(
    private bankCircleConnectorService: BankCircleConnectorService,
    private solutionsGrabberService: SolutionsGrabberService
  ) { }

  ngOnInit() {
    this.solutionsGrabberService.remainingSolutions.subscribe((remainingSolutions) => {
      this.remainingSolutions = remainingSolutions;
    });

    this.solutionsGrabberService.allPiecesUsedSubject.subscribe((allPiecesUsed) => {
      this.allPiecesUsed = allPiecesUsed;
    });

    this.solutionsGrabberService.currentSolutionNumber.subscribe((solnNumber) => {
      this.currentSolutionNumber = solnNumber;
    });
  }

  moveAllToBank() {
    this.bankCircleConnectorService.transferAllToBank();
  }

  moveAllToCircle() {
    this.bankCircleConnectorService.transferAllToCircle('default');
  }

  onGenerateSolutions() {
    const numberOfSolutions = this.solutionsGrabberService.startGeneratingSolutions();
    this.numberOfSolutionsArray = new Array(numberOfSolutions);
  }
  
  onLoadNewSolution(event) {
    const newSolutionNumber = event.target.value;
    this.solutionsGrabberService.switchPieceOrderToNewSolution(newSolutionNumber);
    this.bankCircleConnectorService.transferAllToCircle('newSolution');
  }
}
