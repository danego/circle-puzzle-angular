import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { SolutionsGrabberService } from '../solutions-grabber.service';
import { BankCircleConnectorService } from '../bank-circle-connector.service';


@Component({
  selector: 'piece-bank',
  templateUrl: './piece-bank.component.html',
  styleUrls: ['./piece-bank.component.css']
})
export class PieceBankComponent implements OnInit {
  piecesBank1: any[];
  piecesBank2: any[];
  piecesBank3: any[];
  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;
  displayBankOne: boolean = false;
  displayBankTwo: boolean = false;
  displayBankThree: boolean = false;


  constructor(
    private solutionsGrabberService: SolutionsGrabberService,
    private bankCircleConnectorService: BankCircleConnectorService
  ) { }


  ngOnInit() {
    this.bankCircleConnectorService.moveAllPieces.subscribe((destination: string) => {
      if (destination === 'toBank') {
        //empty all piece arrays in this component
        this.loadAllPieces();
      }
      else if (destination === 'toCircle') {
        //fill all piece arrays
        this.removeAllPieces();
      }
    });

    this.bankCircleConnectorService.isDragging.subscribe((dragData) => {
      if (dragData.layer === 1) {
        this.isDragging1 = dragData.enabled;
      }
      else if (dragData.layer === 2) {
        this.isDragging2 = dragData.enabled;
      }
      else {
        this.isDragging3 = dragData.enabled;
      }
    });

    //call to set up empty arrays for each puzzle piece location ... NAME METHOD BETTER
    this.removeAllPieces();
  }

  dropped(event: CdkDragDrop<string[]>) {
    //move to new, dropped list, only if empty
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  dragStarted(layer: number) {
    if (layer === 1) {
      this.isDragging1 = true;
    }
    else if (layer === 2) {
      this.isDragging2 = true;
    }
    else {
      this.isDragging3 = true;
    }
    this.bankCircleConnectorService.dragStarted(layer);  //might not need to listen in BANK bc cursor is always avlbl ...
  }

  dragEnded(layer: number) {
    if (layer === 1) {
      this.isDragging1 = false;
    }
    else if (layer === 2) {
      this.isDragging2 = false;
    }
    else {
      this.isDragging3 = false;
    }
    this.bankCircleConnectorService.dragEnded(layer);
  }

  checkIsDraggingForBank(layer: number) {
    if (layer === 1) {
      if (this.isDragging2 || this.isDragging3) {
        return 'not-allowed';
      }
      else if (this.isDragging1) {
        return 'grab';
      }
      else {
        return 'default';
      }
    }
    else if (layer === 2) {
      if (this.isDragging1 || this.isDragging3) {
        return 'not-allowed';
      }
      else if (this.isDragging2) {
        return 'grab';
      }
      else {
        return 'default';
      }
    }
    else { //layer 3
      if (this.isDragging1 || this.isDragging2) {
        return 'not-allowed';
      }
      else if (this.isDragging3) {
        return 'grab';
      }
      else {
        return 'default';
      }
    }
  }

  checkToDisplay(layer: number) {
    if (layer === 1 && this.isDragging1) {
      this.displayBankOne = true;
    }
  }

  loadAllPieces() {
    //BANK ONE
    for (let i = 0; i < 10; i++) {
      this.piecesBank1[i] = this.solutionsGrabberService.allPuzzlePieces[1][i];
    }

    //BANK TWO
    for (let i = 0; i < 10; i++) {
      this.piecesBank2[i] = this.solutionsGrabberService.allPuzzlePieces[2][i];
    }

    //BANK THREE
    for (let i = 0; i < 5; i++) {
      this.piecesBank3[i] = this.solutionsGrabberService.allPuzzlePieces[3][i];
    }

  }

  removeAllPieces() {
    this.piecesBank1 = [];
    this.piecesBank2 = [];
    this.piecesBank3 = [];
  }
}
