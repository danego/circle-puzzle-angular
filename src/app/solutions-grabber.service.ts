import { Injectable, OnInit } from '@angular/core';

import { SolutionsGeneratorService } from './solutions-generator.service';

@Injectable({
  providedIn: 'root'
})

export class SolutionsGrabberService {
  allPuzzlePieces = new Array(4);
  currentPuzzlePiecesSequence = new Array(4);
  allGeneratedSolutionsById: any[];

  //Will be connected to ControlPanel Component
  /*
   * should generate all solns at input
   *
   * at switchSolns input, should send new order to circle 
   * - which will then load ALL pieces in, but in new order
   * 
   * SHOULD this service also manage solutionsAvailableCounter? YES since it will store the allSolutionsByIdOrder ... of ID orders
   *
   * ControlPanel => solnsGrabberService => solnsGenerator => listener on circleComponent & load pieces in new order
  */

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

    this.makeDeepCopy();
  }



  startGeneratingSolutions(): number {
    //will return array of allSolutions
    //that array will be made up of Array(4) 
    //where each element corresponds to layer and is array of IDs

    //should return from here to enable the solnSubset radio buttons
    //which will then need its own thing/logic when picking a new soln#
    /* 
     * user clicks new soln#
     * controlPanel => here
     * here => circlePanel listener and loads new soln (does it perform the switiching here or there?)
     * Maybe have default pieces in ID order and one temporary piece order ... which is where we switch
     * see "displayNewSolutionHtml"
     * 
    */
   
    this.allGeneratedSolutionsById = this.solutionsGeneratorService.generateSolutions(this.allPuzzlePieces.slice());
    //this.switchPieceOrderToNewSolution(10);
    return this.allGeneratedSolutionsById.length;
  }

  makeDeepCopy() {
    this.currentPuzzlePiecesSequence = new Array(4);
    this.currentPuzzlePiecesSequence[0] = [];
    this.currentPuzzlePiecesSequence[1] = [...this.allPuzzlePieces[1]];
    this.currentPuzzlePiecesSequence[2] = [...this.allPuzzlePieces[2]];
    this.currentPuzzlePiecesSequence[3] = [...this.allPuzzlePieces[3]];
  }

  switchPieceOrderToNewSolution(solutionNumber: number) {
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
}