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
  isDragging: boolean = false;
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

    this.piecesBank1 = [];
    this.piecesBank2 = [];
    this.piecesBank3 = [];
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
      this.isDragging = true;
    }
    /*
    else if (layer === 2) {
      this.isDragging2 = true;
    }
    else {
      this.isDragging3 = true;
    }
    */
  }
  dragEnded(layer: number) {
    if (layer === 1) {
      this.isDragging = false;
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
