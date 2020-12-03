import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { SolutionsGrabberService } from '../solutions-grabber.service';
import { BankCircleConnectorService } from '../bank-circle-connector.service';


@Component({
  selector: 'circle-representation',
  templateUrl: './circle-representation.component.html',
  styleUrls: ['./circle-representation.component.css']
})
export class CircleRepresentationComponent implements OnInit {
  pieces: any[][];
  piecesBank1;

  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;

  constructor(
    private solutionsGrabberService: SolutionsGrabberService,
    private bankCircleConnectorService: BankCircleConnectorService
  ) { }

  ngOnInit() {
    this.bankCircleConnectorService.moveAllPieces.subscribe((destination: string) => {
      if (destination === 'toBank') {
        //empty all piece arrays in this component
        this.removeAllPieces();
      }
      else if (destination === 'toCircle') {
        //fill all piece arrays
        this.loadAllPieces();
      }
    });

    this.pieces = new Array(4);
    this.pieces[0] = this.solutionsGrabberService.allPuzzlePieces[0].slice();

    //call to set up empty arrays for each puzzle piece location ... NAME METHOD BETTER
    this.removeAllPieces();

    //each piece should be in its own array for drag-&-drop
    //Array Nesting Order: array[layer][d&d/piece][actual piece]   
  }

  dropped(event: CdkDragDrop<string[]>) {
    //move to new, dropped list, only if empty
    if (event.container.data.length === 0) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
        );
    }
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
  }

  loadAllPieces() {
    //Array Nesting Order: array[layer][d&d/piece][actual piece]

    //LAYER ZERO 
    //no need to do because it never changes after initial setup

    //LAYER ONE
    for (let i = 0; i < 10; i++) {
      this.pieces[1][i] = [];
      this.pieces[1][i][0] = {...this.solutionsGrabberService.allPuzzlePieces[1][i]};
    }

    //LAYER TWO
    this.pieces[2] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[2][i] = [];
      this.pieces[2][i][0] = {...this.solutionsGrabberService.allPuzzlePieces[2][i]};
    }

    //LAYER THREE
    this.pieces[3] = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.pieces[3][i] = [];
      this.pieces[3][i][0] = {...this.solutionsGrabberService.allPuzzlePieces[3][i]};
    }
  }

  removeAllPieces() {
    this.pieces[1] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[1][i] = [];
    }

    this.pieces[2] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[2][i] = [];
    }

    this.pieces[3] = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.pieces[3][i] = [];
    }
  }
}
