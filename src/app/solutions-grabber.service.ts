import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { SolutionsGeneratorService } from './solutions-generator.service';
import { PiecesCatalogService } from './pieces-catalog.service';

@Injectable({
  providedIn: 'root'
})

export class SolutionsGrabberService {
  allPuzzlePieces = new Array(4);
  currentPuzzlePiecesSequence = new Array(4);
  private _currentSolutionById: any[];  
  private allGeneratedSolutionsById: any[];
  remainingSolutions = new BehaviorSubject<number>(null);
  allPiecesUsed: boolean = false;
  private currentPattern: string = 'Planets';

  allPiecesUsedSubject = new Subject<boolean>();
  currentSolutionNumber = new Subject<number>();


  constructor(
    private solutionsGeneratorService: SolutionsGeneratorService,
    private piecesCatalogService: PiecesCatalogService
  ) {
    //get pieces for default pattern (planets)
    this.allPuzzlePieces = this.piecesCatalogService.getPiecesForSelectedPattern();

    //initialize currentPuzzlePiecesSequence to track loaded piece sequence (used to update in CircleComponent)
    this.makeDeepCopy();

    //initialize _currentSolutionById to track only IDs
    this.setupPieceIds();

    //TEMPORARY FIX ... MIGHT MOVE ELSEWHERE
    this.startGeneratingSolutions('planets');
    this.setupPieceIdsEmpty();
    this.computeRemainingSolutions(this._currentSolutionById);
  }

  //ADD CURRENT LAYOUT && ALREADY EXISITNG CONDITIONAL
  startGeneratingSolutions(newPattern?: string): number {
    //only generates solutions if not already done (ie passed in non-matching pattern)
    //Later will need similar logic for different patterns (coins, scarabs)
    if (newPattern && newPattern !== this.currentPattern) {
      this.allGeneratedSolutionsById = this.solutionsGeneratorService.generateSolutions(this.allPuzzlePieces.slice());
      this.currentPattern = newPattern;
    }
    return this.allGeneratedSolutionsById.length;
  }

  private makeDeepCopy() {
    this.currentPuzzlePiecesSequence = new Array(4);
    this.currentPuzzlePiecesSequence[0] = [...this.allPuzzlePieces[0]];
    this.currentPuzzlePiecesSequence[1] = [...this.allPuzzlePieces[1]];
    this.currentPuzzlePiecesSequence[2] = [...this.allPuzzlePieces[2]];
    this.currentPuzzlePiecesSequence[3] = [...this.allPuzzlePieces[3]];
  }

  private makeDeepCopyFromSolution(solutionNumber: number) {
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = [...this.allGeneratedSolutionsById[solutionNumber][0]];
    this._currentSolutionById[1] = [...this.allGeneratedSolutionsById[solutionNumber][1]];
    this._currentSolutionById[2] = [...this.allGeneratedSolutionsById[solutionNumber][2]];
  }

  private setupPieceIds() {
    //initializes ID tracker to default puzzle piece order
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this._currentSolutionById[1] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this._currentSolutionById[2] = [0, 1, 2, 3, 4];
  }

  private setupPieceIdsEmpty() {
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = new Array(10).fill('');
    this._currentSolutionById[1] = new Array(10).fill('');
    this._currentSolutionById[2] = new Array(10).fill('');
  }

  changeCurrentPattern(pattern: string) {
    this.allPuzzlePieces = this.piecesCatalogService.getPiecesForSelectedPattern(pattern);

    //initialize currentPuzzlePiecesSequence to track loaded piece sequence (used to update in CircleComponent)
    this.makeDeepCopy();

    //initialize _currentSolutionById to track only IDs
    this.setupPieceIds();

    this.startGeneratingSolutions(pattern);
    this.setupPieceIdsEmpty();
    this.computeRemainingSolutions(this._currentSolutionById);
  }

  moveAllPieces(moveType: string, solutionNumber?: number) {
    if (moveType === 'toBank') {
      this.setupPieceIdsEmpty();
    }
    else if (moveType === 'toCircle') {
      //toCircle is either default order of pieces OR a new solution
      if (solutionNumber || solutionNumber === 0) {
        this.switchPieceOrderToNewSolution(solutionNumber);
      }
      else {
        this.switchPieceOrderToDefault();
      }
    }
    this.computeRemainingSolutions();
  }

  private switchPieceOrderToNewSolution(solutionNumber: number) {
    //update ID tracker 
    this.makeDeepCopyFromSolution(solutionNumber);
    
    //separate bc solutions do not include fixed layer 0
    //Layer One
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[1][i].id !== this.allGeneratedSolutionsById[solutionNumber][0][i])) {
        for (let j = i; j < 10; j++) {
          if (this.currentPuzzlePiecesSequence[1][j].id === this.allGeneratedSolutionsById[solutionNumber][0][i]) {
            this.switchPuzzlePieces(i, j, 1);
          }
        }
      }
    }
    //Layer Two
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[2][i].id !== this.allGeneratedSolutionsById[solutionNumber][1][i])) {
        for (let j = i; j < 10; j++) {
          if (this.currentPuzzlePiecesSequence[2][j].id === this.allGeneratedSolutionsById[solutionNumber][1][i]) {
            this.switchPuzzlePieces(i, j, 2);
          }
        }
      }
    }
    //Layer Three
    for (let i = 0; i < 5; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[3][i].id !== this.allGeneratedSolutionsById[solutionNumber][2][i])) {
        for (let j = i; j < 5; j++) {
          if (this.currentPuzzlePiecesSequence[3][j].id === this.allGeneratedSolutionsById[solutionNumber][2][i]) {
            this.switchPuzzlePieces(i, j, 3);
          }
        }
      }
    }
  }

  private switchPieceOrderToDefault() {
    //update ID tracker 
    this.setupPieceIds();    

    //separate bc solutions do not include fixed layer 0
    //Layer One
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[1][i].id !== i)) {
        for (let j = i; j < 10; j++) {
          if (this.currentPuzzlePiecesSequence[1][j].id === i) {
            this.switchPuzzlePieces(i, j, 1);
          }
        }
      }
    }
    //Layer Two
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[2][i].id !== i)) {
        for (let j = i; j < 10; j++) {
          if (this.currentPuzzlePiecesSequence[2][j].id === i) {
            this.switchPuzzlePieces(i, j, 2);
          }
        }
      }
    }
    //Layer Three
    for (let i = 0; i < 5; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.currentPuzzlePiecesSequence[3][i].id !== i)) {
        for (let j = i; j < 5; j++) {
          if (this.currentPuzzlePiecesSequence[3][j].id === i) {
            this.switchPuzzlePieces(i, j, 3);
          }
        }
      }
    }
  }

  private switchPuzzlePieces(switchSpotIndex, toSwitchInIndex, layerNumber) {
    let holdFirstPiece = {...this.currentPuzzlePiecesSequence[layerNumber][switchSpotIndex]};
    this.currentPuzzlePiecesSequence[layerNumber][switchSpotIndex] = {...this.currentPuzzlePiecesSequence[layerNumber][toSwitchInIndex]};
    this.currentPuzzlePiecesSequence[layerNumber][toSwitchInIndex] = holdFirstPiece;
  }

  //deeply copies ID arrays from current solution
  get currentSolutionById() {
    const deepCopiedCurrentSolution = new Array(3);

    for (let layer = 0; layer < 3; layer++) {
      deepCopiedCurrentSolution[layer] = [...this._currentSolutionById[layer]];
    }
    return deepCopiedCurrentSolution;
  }

  computeRemainingSolutions(currentIdSequence?: any[][]) {
    //empty argument is used for moving all pieces: empty, default, or new solution
    currentIdSequence = currentIdSequence || this._currentSolutionById;
    /* 
     * compare inputted sequence w/ every soln of 63
     * quick exit if any position in any layer is not a match 
     * SO ... must be empty (=== "") or must match 
     */
    let remainingSolutions = 0;

    //solutions
    solnLoop: for (let soln = 0; soln < this.allGeneratedSolutionsById.length; soln++) {
      //layers
      for (let layer = 0; layer < 3; layer++) {
        let currentIdSequenceLayer = currentIdSequence[layer];
        //pieceIds
        for (let piece = 0; piece < currentIdSequenceLayer.length; piece++) {
          if (currentIdSequenceLayer[piece] !== "" && currentIdSequenceLayer[piece] !== this.allGeneratedSolutionsById[soln][layer][piece]) {
            continue solnLoop;
          }
        }
      }
      //all layers and pieces are a go
      remainingSolutions++;
    }

    //emit updated status only if already true
    if (this.allPiecesUsed) {
      this.allPiecesUsed = false;
      this.allPiecesUsedSubject.next(false);
    }
    //potentially update display current solution and allPiecesUsed
    if (remainingSolutions === 1) {
      this.determineCurrentSolutionNumber(currentIdSequence);
    }

    this.remainingSolutions.next(remainingSolutions);
  }

  private determineCurrentSolutionNumber(currentIdSequence?: any[][]) {
    //runs through current ID sequence checking all pieces are used (no empty strings)
    for (let i = 0; i < 3; i++) {
      let currentIdSequenceLayer = currentIdSequence[i];
      //pieceIds
      for (let piece = 0; piece < currentIdSequenceLayer.length; piece++) {
        if (currentIdSequenceLayer[piece] === '') {
          //if some spots are empty, then no need to update allPiecesUsed or check for matching solution below
          return;
        }
      }
    }
    this.allPiecesUsed = true;
    this.allPiecesUsedSubject.next(true);

    let currentSolutionNumber;
    //goes through each soln in allSolutions to find matching one
    solnLoop: for (let soln = 0; soln < this.allGeneratedSolutionsById.length; soln++) {
      //layers
      for (let layer = 0; layer < 3; layer++) {
        let currentIdSequenceLayer = currentIdSequence[layer];
        //pieceIds
        for (let piece = 0; piece < currentIdSequenceLayer.length; piece++) {
          if (currentIdSequenceLayer[piece] !== this.allGeneratedSolutionsById[soln][layer][piece]) {
            continue solnLoop;
          }
        }
      }
      currentSolutionNumber = soln;
      break solnLoop;
    }

    this.currentSolutionNumber.next(currentSolutionNumber);
  }
}