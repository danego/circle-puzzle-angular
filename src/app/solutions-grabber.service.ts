import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { SolutionsGeneratorService } from './solutions-generator.service';

@Injectable({
  providedIn: 'root'
})

export class SolutionsGrabberService {
  allPuzzlePieces = new Array(4);
  currentPuzzlePiecesSequence = new Array(4);
  private _currentSolutionById: any[];  
  allGeneratedSolutionsById: any[];
  remainingSolutions = new BehaviorSubject<number>(null);
  allPiecesUsed: boolean = false;
  allPiecesUsedSubject = new Subject<boolean>();
  currentSolutionNumber = new Subject<number>();


  constructor(
    private solutionsGeneratorService: SolutionsGeneratorService
  ) {
    //Keep for clarity elsewhere ... consistent layer numbering
    this.allPuzzlePieces[0] = ['G', 'G', 'G', 'P', 'P', 'P', 'G', 'G', 'P', 'P'];
    this.allPuzzlePieces[1] = [
      {top:'G', left:'P', right:'O', id: 0},
      {top:'G', left:'G', right:'P', id: 1},
      {top:'G', left:'O', right:'G', id: 2},
      {top:'G', left:'P', right:'P', id: 3},
      {top:'G', left:'O', right:'O', id: 4},
      {top:'P', left:'P', right:'O', id: 5},
      {top:'P', left:'O', right:'P', id: 6},
      {top:'P', left:'G', right:'P', id: 7},
      {top:'P', left:'O', right:'G', id: 8},
      {top:'P', left:'G', right:'G', id: 9}
    ];
    this.allPuzzlePieces[2] = [
      {left:'G', right:'P', bottom:'O', id: 0},
      {left:'O', right:'G', bottom:'P', id: 1},
      {left:'P', right:'O', bottom:'P', id: 2},
      {left:'O', right:'P', bottom:'G', id: 3},
      {left:'G', right:'O', bottom:'O', id: 4},
      {left:'P', right:'G', bottom:'G', id: 5},
      {left:'P', right:'O', bottom:'G', id: 6},
      {left:'O', right:'O', bottom:'P', id: 7},
      {left:'P', right:'P', bottom:'G', id: 8},
      {left:'G', right:'G', bottom:'O', id: 9}
    ];
    this.allPuzzlePieces[3] = [
      {left:'P', right:'G', id: 0}, 
      {left:'O', right:'G', id: 1}, 
      {left:'G', right:'P', id: 2}, 
      {left:'G', right:'O', id: 3},
      {left:'O', right:'P', id: 4}
    ];

    //initialize currentPuzzlePiecesSequence to track loaded piece sequence (used to update in CircleComponent)
    this.makeDeepCopy();

    //initialize _currentSolutionById to track only IDs
    this.setupPieceIds();

    //TEMPORARY FIX ... MIGHT MOVE ELSEWHERE
    this.startGeneratingSolutions();
    this.setupPieceIdsEmpty();
    this.computeRemainingSolutions(this._currentSolutionById);
  }

  startGeneratingSolutions(): number {
    //only generates solutions if not already done
    //Later will need similar logic for different patterns (coins, scarabs)
    if (!this.allGeneratedSolutionsById) {
      this.allGeneratedSolutionsById = this.solutionsGeneratorService.generateSolutions(this.allPuzzlePieces.slice());
    }
    return this.allGeneratedSolutionsById.length;
  }

  makeDeepCopy() {
    this.currentPuzzlePiecesSequence = new Array(4);
    this.currentPuzzlePiecesSequence[0] = [];
    this.currentPuzzlePiecesSequence[1] = [...this.allPuzzlePieces[1]];
    this.currentPuzzlePiecesSequence[2] = [...this.allPuzzlePieces[2]];
    this.currentPuzzlePiecesSequence[3] = [...this.allPuzzlePieces[3]];
  }

  makeDeepCopyFromSolution(solutionNumber: number) {
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = [...this.allGeneratedSolutionsById[solutionNumber][0]];
    this._currentSolutionById[1] = [...this.allGeneratedSolutionsById[solutionNumber][1]];
    this._currentSolutionById[2] = [...this.allGeneratedSolutionsById[solutionNumber][2]];
  }

  setupPieceIds() {
    //initializes ID tracker to default puzzle piece order
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this._currentSolutionById[1] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this._currentSolutionById[2] = [0, 1, 2, 3, 4];
  }

  setupPieceIdsEmpty() {
    this._currentSolutionById = new Array(3);
    this._currentSolutionById[0] = new Array(10).fill('');
    this._currentSolutionById[1] = new Array(10).fill('');
    this._currentSolutionById[2] = new Array(10).fill('');
  }

  switchPieceOrderToNewSolution(solutionNumber: number) {
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

  switchPuzzlePieces(switchSpotIndex, toSwitchInIndex, layerNumber) {
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

  determineCurrentSolutionNumber(currentIdSequence?: any[][]) {
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