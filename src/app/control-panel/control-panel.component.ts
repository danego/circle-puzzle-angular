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

  constructor(
    private bankCircleConnectorService: BankCircleConnectorService,
    private solutionsGrabberService: SolutionsGrabberService
  ) { }

  ngOnInit() {
    
  }

  moveAllToBank() {
    this.bankCircleConnectorService.transferAllToBank();

  }
  moveAllToCircle() {
    this.bankCircleConnectorService.transferAllToCircle();
  }

  onGenerateSolutions() {
    const numberOfSolutions = this.solutionsGrabberService.startGeneratingSolutions();
    this.numberOfSolutionsArray = new Array(numberOfSolutions);
  }
  
  onLoadNewSolution(event) {
    console.log(event.target.value);
    const newSolutionNumber = event.target.value;

    this.solutionsGrabberService.switchPieceOrderToNewSolution(newSolutionNumber);
    this.bankCircleConnectorService.transferAllToCircle();  //HERE OR ELSESWHERE ... 
  }
}
