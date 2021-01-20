import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { SolutionsGrabberService } from '../solutions-grabber.service';
import { BankCircleConnectorService } from '../bank-circle-connector.service';
import { PieceSizingService } from '../piece-sizing.service';


@Component({
  selector: 'piece-bank',
  templateUrl: './piece-bank.component.html',
  styleUrls: ['./piece-bank.component.css']
})

export class PieceBankComponent implements OnInit, OnDestroy {
  piecesBank1: any[];
  piecesBank2: any[];
  piecesBank3: any[];
  displayColorLetters: boolean = true;
  fontSizeFactor: number = 2;
  fontSizeForPieces: number;
  containerSize: number;
  minBankWidth: number;
  
  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;
  //used to add fake space to bank to fit piece
  isDraggingIncoming1: boolean = false;
  isDraggingIncoming2: boolean = false;
  isDraggingIncoming3: boolean = false;
  isHoveringOverBank: boolean = false;

  displayBankOne: boolean = false;
  displayBankTwo: boolean = false;
  displayBankThree: boolean = false;
  displayBankOneTemporary: boolean = false;
  displayBankTwoTemporary: boolean = false;
  displayBankThreeTemporary: boolean = false;

  piecesDropdownHeight1: string = 'auto';
  piecesDroplistHeight1: string = 'auto';
  piecesDropdownHeight2: string = 'auto';
  piecesDroplistHeight2: string = 'auto';
  piecesDropdownHeight3: string = 'auto';
  piecesDroplistHeight3: string = 'auto';

  moveAllPieces: Subscription;
  isDragging: Subscription;
  droppedPiece: Subscription;
  toggleColorLetters: Subscription;
  fontSizeFactorSub: Subscription;
  fontSizeForPiecesSub: Subscription;
  containerSizeSub: Subscription;
  minBankWidthSub: Subscription;

  constructor(
    private solutionsGrabberService: SolutionsGrabberService,
    private bankCircleConnectorService: BankCircleConnectorService,
    private pieceSizingService: PieceSizingService
  ) { }


  ngOnInit() {
    this.moveAllPieces = this.bankCircleConnectorService.moveAllPieces.subscribe((destination: string) => {
      if (destination === 'toBank') {
        //empty all piece arrays in this component
        this.loadAllPieces();
      }
      else if (destination === 'toCircle') {
        //fill all piece arrays
        this.removeAllPieces();
      }
      this.calculatePieceContainerHeight();
    });

    this.isDragging = this.bankCircleConnectorService.isDraggingFromCircle.subscribe((dragData) => {
      if (dragData.layer === 1) {
        this.isDragging1 = dragData.enabled;
        this.isDraggingIncoming1 = dragData.enabled;
        this.displayBankOneTemporary = false;
      }
      else if (dragData.layer === 2) {
        this.isDragging2 = dragData.enabled;
        this.isDraggingIncoming2 = dragData.enabled;
        this.displayBankTwoTemporary = false;
      }
      else {
        this.isDragging3 = dragData.enabled;
        this.isDraggingIncoming3 = dragData.enabled;
        this.displayBankThreeTemporary = false;
      }

      if (!dragData.enabled) {
        this.calculatePieceContainerHeight();
      }
    });

    this.droppedPiece = this.bankCircleConnectorService.pieceDroppedInCircle.subscribe((layer) => {
      //check if actually open ...
      this.calculatePieceContainerHeight(layer);
    });

    //turn on/off letters on span elements for pieces
    this.toggleColorLetters = this.bankCircleConnectorService.displayColorLetters.subscribe((lettersEnabled) => {
      this.displayColorLetters = lettersEnabled;
    });

    //updates fontSize to correctly size pieces and incoming piece margins
    this.fontSizeFactorSub = this.pieceSizingService.fontSizeFactor.subscribe((newFontSize) => {
      this.fontSizeFactor = newFontSize;
    });

    //update actual fontSize for text on pieces
    this.fontSizeForPiecesSub = this.pieceSizingService.fontSizeForPieces.subscribe((newFontSize) => {
      this.fontSizeForPieces = newFontSize;
    });

    //updates container size for scrolling piece banks
    this.containerSizeSub = this.pieceSizingService.containerSize.subscribe((newContainerSize) => {
      const containerHeightMinusMargins = newContainerSize - 20;
      this.containerSize = containerHeightMinusMargins;
    });

    this.minBankWidthSub = this.pieceSizingService.minBankSize.subscribe(newBankWidth => {
      this.minBankWidth = newBankWidth;
    });


    //call to set up empty arrays for each puzzle piece location ... NAME METHOD BETTER
    this.removeAllPieces();
    this.calculatePieceContainerHeight();
  }

  dropped(event: CdkDragDrop<string[]>) {
    this.updatePiecesByIdTracker(event);

    //move to new, dropped list even if not empty
    //event.currentIndex is replaced by 0 bc we always want to drop to top of bank (disabledSorting)
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      0
    );

    this.calculatePieceContainerHeight();
  }

  updatePiecesByIdTracker(event: CdkDragDrop<string[]>) {
    //store new position for ID  
    const stringToNum = {
      one: 1,
      two: 2,
      three: 3
    };

    //sends dropped info to Circle Component only if drop comes from there
    const containerIdArray = event.previousContainer.id.split('-');
    if (containerIdArray[0] === 'dl') {
      const layer = stringToNum[containerIdArray[1]] - 1;
      const pieceId = (event.previousContainer.data[event.previousIndex] as any).id; //ADD MODEL/Interfaces for DIFF Pieces
      const oldPosition = +containerIdArray[2];
      
      this.bankCircleConnectorService.droppedUpdatePiecesById(layer, oldPosition, pieceId);
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
    this.bankCircleConnectorService.dragStartedFromBank(layer);  //might not need to listen in BANK bc cursor is always avlbl ...
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
    this.bankCircleConnectorService.dragEndedFromBank(layer);
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

  checkToDisplayStatic(layer: number) {
    if (layer === 1) {
      this.displayBankOne = !this.displayBankOne;
      this.displayBankOneTemporary = false;
    }
    else if (layer === 2) {
      this.displayBankTwo = !this.displayBankTwo;
      this.displayBankTwoTemporary = false;
    }
    else if (layer === 3) {
      this.displayBankThree = !this.displayBankThree;
      this.displayBankThreeTemporary = false;
    }
    this.calculatePieceContainerHeight();
  }

  checkToDisplayDragging() {
    if (this.isDragging1) {
      this.displayBankOneTemporary = true;
    }
    else if (this.isDragging2) {
      this.displayBankTwoTemporary = true;
    }
    else if (this.isDragging3) {
      this.displayBankThreeTemporary = true;
    }
  }

  onHoverOverBank(entering: boolean) {
    if (entering) this.isHoveringOverBank = true;
    else this.isHoveringOverBank = false;

    this.calculatePieceContainerHeight();
    this.checkToDisplayDragging();
  }

  calculatePieceContainerHeight(layer?: number) {
    //call for all three layers
    if (!layer) {
      this.calculatePieceContainerHeightOne();
      this.calculatePieceContainerHeightTwo();
      this.calculatePieceContainerHeightThree();
    }
    //run for only one layers
    else {
      switch (layer) {
        case 1: this.calculatePieceContainerHeightOne();
                break;
        case 2: this.calculatePieceContainerHeightTwo();
                break;
        case 3: this.calculatePieceContainerHeightThree();
                break;
      }
    }  
  }

  calculatePieceContainerHeightOne(containerHeight = 0, dropdown = 'auto', droplist = '76px') {
    //LAYER ONE
    const pieceHeight = 7.6 * this.fontSizeFactor;

    if (this.displayBankOne || this.displayBankOneTemporary) {
      containerHeight = this.piecesBank1.length * pieceHeight;
      //check for minimum height
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    if (this.isDraggingIncoming1 && this.isHoveringOverBank) {
      containerHeight = (this.piecesBank1.length + 1) * pieceHeight;
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    this.piecesDroplistHeight1 = droplist;
    this.piecesDropdownHeight1 = dropdown;
  }

  calculatePieceContainerHeightTwo(containerHeight = 0, dropdown = 'auto', droplist = '76px') {
    //LAYER TWO
    const pieceHeight = 7.6 * this.fontSizeFactor;

    if (this.displayBankTwo || this.displayBankTwoTemporary) {
      containerHeight = (Math.ceil(this.piecesBank2.length / 2)) * pieceHeight;
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    if (this.isDraggingIncoming2 && this.isHoveringOverBank) {
      //add one to make room for incoming piece
      containerHeight = (Math.ceil((this.piecesBank2.length + 1) / 2)) * pieceHeight;
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    this.piecesDropdownHeight2 = dropdown;
    this.piecesDroplistHeight2 = droplist;
  }

  calculatePieceContainerHeightThree(containerHeight = 0, dropdown = 'auto', droplist = '50px') {
     //LAYER THREE
     const pieceHeight = 4 * this.fontSizeFactor;

     if (this.displayBankThree || this.displayBankThreeTemporary) {
      containerHeight = this.piecesBank3.length * pieceHeight;
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    if (this.isDraggingIncoming3 && this.isHoveringOverBank) {
      containerHeight = (this.piecesBank3.length + 1) * pieceHeight;
      if (containerHeight < 76) containerHeight = 76;

      dropdown = containerHeight + 55 + 'px';
      droplist = containerHeight + 'px';
    }
    this.piecesDroplistHeight3 = droplist;
    this.piecesDropdownHeight3 = dropdown;
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

  ngOnDestroy() {
    if (this.moveAllPieces) this.moveAllPieces.unsubscribe();
    if (this.isDragging) this.isDragging.unsubscribe();
    if (this.droppedPiece) this.droppedPiece.unsubscribe();
    if (this.toggleColorLetters) this.toggleColorLetters.unsubscribe();
    if (this.fontSizeFactorSub) this.fontSizeFactorSub.unsubscribe();
    if (this.fontSizeForPiecesSub) this.fontSizeForPiecesSub.unsubscribe();
    if (this.containerSizeSub) this.containerSizeSub.unsubscribe();
    if (this.minBankWidthSub) this.minBankWidthSub.unsubscribe();
  }
}
