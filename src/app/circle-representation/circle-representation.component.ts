import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { SolutionsGrabberService } from '../solutions-grabber.service';
import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { PieceSizingService } from '../piece-sizing.service';
import { SizingDataInterface } from '../sizing-data.interface';


@Component({
  selector: 'circle-representation',
  templateUrl: './circle-representation.component.html',
  styleUrls: ['./circle-representation.component.css']
})

export class CircleRepresentationComponent implements OnInit, OnDestroy {
  pieces: any[][];
  piecesByID: any[] = new Array(3);
  displayColorLetters: boolean = true;
  fontSizeFactor: number;
  fontSizeForPieces: number;
  pieceSizes: SizingDataInterface;

  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;
  
  moveAllPieces: Subscription;
  isDragging: Subscription;
  droppedPieceData: Subscription;
  toggleColorLetters: Subscription;
  pieceSizesSub: Subscription;

  constructor(
    private solutionsGrabberService: SolutionsGrabberService,
    private bankCircleConnectorService: BankCircleConnectorService,
    private pieceSizingService: PieceSizingService
  ) { }

  ngOnInit() {
    //updates ALL pieces to either empty, default, or current solution
    this.moveAllPieces = this.bankCircleConnectorService.moveAllPieces.subscribe((destination: string) => {
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
    this.isDragging = this.bankCircleConnectorService.isDraggingFromBank.subscribe((dragData) => {
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
    this.droppedPieceData = this.bankCircleConnectorService.droppedPieceData.subscribe((droppedPieceData) => {
      this.updatePiecesByIdTrackerRemove(droppedPieceData);
      this.solutionsGrabberService.computeRemainingSolutions(this.piecesByID);
    });

    //turn on/off letters on span elements for pieces
    this.toggleColorLetters = this.bankCircleConnectorService.displayColorLetters.subscribe((lettersEnabled) => {
      this.displayColorLetters = lettersEnabled;
    });

    //get global piece sizes, overall puzzle sizing, & piece font size, 
    this.pieceSizesSub = this.pieceSizingService.pieceSizes.subscribe(pieceSizesData => {
      this.pieceSizes = pieceSizesData;
      this.fontSizeFactor = pieceSizesData.fontSizeFactor;
      if (pieceSizesData.fontSizeForPieces) {
        this.fontSizeForPieces = pieceSizesData.fontSizeForPieces;
      }
    });

    this.pieces = new Array(4);
    //initialize static Layer Zero
    this.pieces[0] = [];
    for (let i = 0; i < 10; i++) {
      this.pieces[0][i] = {
        top: this.solutionsGrabberService.currentPuzzlePiecesSequence[0][i]
      };
    }

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
    this.piecesByID[droppedPieceData.layer][droppedPieceData.position] = '';
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
    //because each piece should be in its own array for drag-&-drop (except layer 0)
    //LAYER ZERO 
    this.pieces[0] = [];
    for (let i = 0; i < 10; i++) {
      this.pieces[0][i] = {
        top: this.solutionsGrabberService.currentPuzzlePiecesSequence[0][i]
      };
    }

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

  //each piece has between 1-3 colors, aka dots
  //apply corresponding class to dot's text/value
  applyCorrectColorClass(pieceDotText: string) {
    //[ngClass]="{ 'green': piece === 'G', 'orange': piece === 'O', 'purple': piece === 'P' }">
    let className;
    switch(pieceDotText) {
      case 'G': className = 'green';
                break;
      case 'O': className = 'orange';
                break;
      case 'P': className = 'purple';
                break;
      case 'T': className = 'teal';
                break;   
      case 'R': className = 'red';
                break;  
      case 'AU': className = 'gold';
                break;
      case 'S': className = 'silver';
                break;
      case 'B': className = 'bronze';
                break;
      case 'C': className = 'copper';
                break;                
    }
    return className;
  }

  ngOnDestroy() {
    if (this.moveAllPieces) this.moveAllPieces.unsubscribe();
    if (this.isDragging) this.isDragging.unsubscribe();
    if (this.droppedPieceData) this.droppedPieceData.unsubscribe();
    if (this.toggleColorLetters) this.toggleColorLetters.unsubscribe();
    if (this.pieceSizesSub) this.pieceSizesSub.unsubscribe();
  }
 }
