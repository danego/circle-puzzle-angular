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
  piecesByID: any[] = new Array(3);

  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;

  constructor(
    private solutionsGrabberService: SolutionsGrabberService,
    private bankCircleConnectorService: BankCircleConnectorService
  ) { }

  ngOnInit() {
    //updates ALL pieces to either empty, default, or current solution
    this.bankCircleConnectorService.moveAllPieces.subscribe((destination: string) => {
      if (destination === 'toBank') {
        //empty all piece arrays in this component
        this.loadEmptyPieceSequence();

        this.piecesByID = new Array(3);
        this.piecesByID[0] = new Array(10).fill('');
        this.piecesByID[1] = new Array(10).fill('');
        this.piecesByID[2] = new Array(5).fill('');
      }
      else if (destination === 'toCircle') {
        //fill all piece arrays
        this.loadAllPieces();
        this.piecesByID = this.solutionsGrabberService.currentSolutionById;
      }
    });

    //updates isDragging data for correct cursor display from BankComponent
    this.bankCircleConnectorService.isDraggingFromBank.subscribe((dragData) => {
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
    
    //updates piecesById tracker when piece is dropped into bank (ie removed)
    this.bankCircleConnectorService.droppedPieceData.subscribe((droppedPieceData) => {
      this.updatePiecesByIdTrackerRemove(droppedPieceData);
      this.solutionsGrabberService.computeRemainingSolutions(this.piecesByID);
    });

    this.pieces = new Array(4);
    this.pieces[0] = this.solutionsGrabberService.allPuzzlePieces[0].slice();

    //call to set up empty arrays for each puzzle piece location ... NAME METHOD BETTER
    this.loadEmptyPieceSequence();   
  }

  dropped(event: CdkDragDrop<string[]>) {
    //move to new, dropped list, only if empty
    if (event.container.data.length === 0) {
      //will be either false or layer number if dropped from bank
      const layer = this.updatePiecesByIdTracker(event);
      this.solutionsGrabberService.computeRemainingSolutions(this.piecesByID);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      //call to inform and resize piece bank
      if (layer) {
        this.bankCircleConnectorService.droppedInCircle(layer);
      }
    }
  }
   
  updatePiecesByIdTracker(event: CdkDragDrop<string[]>) {
    //store new position for ID  
    const stringToNum = {
      one: 1,
      two: 2,
      three: 3
    };
    const containerIdArray = event.container.id.split('-');
    const layer = stringToNum[containerIdArray[1]] - 1;
    const pieceId = (event.previousContainer.data[event.previousIndex] as any).id; //ADD MODEL/Interfaces for DIFF Pieces
    const newPosition = +containerIdArray[2];
    let layerIfFromBank: any = false;

    //only remove if piece coming from circle, not bankComponent
    if (event.previousContainer.id.split('-')[0] === 'dl') {
      const oldPosition = +event.previousContainer.id.split('-')[2];
      this.updatePiecesByIdTrackerRemove({layer: layer, position: oldPosition, pieceId: pieceId});
    }
    //if coming from bankComponent, return layer to inform bankComponent
    else {
      layerIfFromBank = layer + 1;
    }

    this.updatePiecesByIdTrackerAdded({layer: layer, position: newPosition, pieceId: pieceId});

    return layerIfFromBank;
  }
  
  updatePiecesByIdTrackerAdded(droppedPieceData: {layer: number, position: number, pieceId: number}) {
    this.piecesByID[droppedPieceData.layer][droppedPieceData.position] = droppedPieceData.pieceId;
  }

  updatePiecesByIdTrackerRemove(droppedPieceData: {layer: number, position: number, pieceId: number}) {
    //this.piecesByID[droppedPieceData.layer].splice(droppedPieceData.position, 1);
    this.piecesByID[droppedPieceData.layer][droppedPieceData.position] = '';
    //console.log(this.piecesByID);
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
    this.bankCircleConnectorService.dragStartedFromCircle(layer);
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
    this.bankCircleConnectorService.dragEndedFromCircle(layer);
  }

  loadAllPieces() {
    //Array Nesting Order: array[layer][d&d/piece][actual piece]
    //because each piece should be in its own array for drag-&-drop

    //LAYER ZERO 
    //no need to do because it never changes after initial setup

    //LAYER ONE
    for (let i = 0; i < 10; i++) {
      this.pieces[1][i] = [];
      this.pieces[1][i][0] = {...this.solutionsGrabberService.currentPuzzlePiecesSequence[1][i]};
    }

    //LAYER TWO
    this.pieces[2] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[2][i] = [];
      this.pieces[2][i][0] = {...this.solutionsGrabberService.currentPuzzlePiecesSequence[2][i]};
    }

    //LAYER THREE
    this.pieces[3] = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.pieces[3][i] = [];
      this.pieces[3][i][0] = {...this.solutionsGrabberService.currentPuzzlePiecesSequence[3][i]};
    }
  }

  loadEmptyPieceSequence() {
    //Array Nesting Order: array[layer][d&d/piece][actual piece]
    //because each piece should be in its own array for drag-&-drop
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
