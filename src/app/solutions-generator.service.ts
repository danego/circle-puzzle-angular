import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SolutionsGeneratorService {
  private allPuzzlePieces: any[];
  private allSolvedPuzzlePieces: any[];

  constructor() {}

  generateSolutions(allPuzzlePieces: any[]) {
    //allPuzzlePieces = Array(4) 
    this.allPuzzlePieces = allPuzzlePieces;
    this.allSolvedPuzzlePieces = new Array();

    console.log('STARTED');
    let simpleNumArray = [0,1,2,3,4,5,6,7,8,9];
    this.row1Perm(0, 0, simpleNumArray);
    console.log('COMPLETED');

    return this.allSolvedPuzzlePieces;
  }

  // Fits Row Functions:
  //checks fit of new puzzlePiece in given index/location (0 --> 9)
  //puzzlePiece param should be a cell of arrPuzzlePieces
  private fitsRowOne(indexToCheck, puzzlePiece) {
    
    if (this.allPuzzlePieces[0][indexToCheck] === puzzlePiece.top) {
      return true;
    }
    else {
      return false;
    }
  }
  
  //checks fit of new puzzlePiece in given index/location (0 --> 9)
  private fitsRowTwo(indexToCheck, puzzlePiece) {
    
    let rowOneLeftIndex,
    rowOneRightIndex;
    if (indexToCheck === 0) {
      rowOneLeftIndex = 9;
      rowOneRightIndex = 0;
    }
    else {
      rowOneLeftIndex = indexToCheck - 1;
      rowOneRightIndex = indexToCheck;
    }
    
    if (
      this.allPuzzlePieces[1][rowOneLeftIndex].right === puzzlePiece.left 
      && this.allPuzzlePieces[1][rowOneRightIndex].left === puzzlePiece.right
      ) {
        return true;
      }
      else {
        return false;
      }
  }
    
  //checks fit of new puzzlePiece in given index/location (0 --> 4)
  private fitsRowThree(indexToCheck, puzzlePiece) {
    
    let rowTwoLeftIndex,
    rowTwoRightIndex;
    if (indexToCheck === 0) {
      rowTwoLeftIndex = 1;
      rowTwoRightIndex = 2;
    }
    else if (indexToCheck === 1) {
      rowTwoLeftIndex = 3;
      rowTwoRightIndex = 4;
    }
    else if (indexToCheck === 2) {
      rowTwoLeftIndex = 5;
      rowTwoRightIndex = 6;
    }
    else if (indexToCheck === 3) {
      rowTwoLeftIndex = 7;
      rowTwoRightIndex = 8;
    }
    else {
      rowTwoLeftIndex = 9;
      rowTwoRightIndex = 0;
    }
    
    if (
      this.allPuzzlePieces[2][rowTwoLeftIndex].bottom === puzzlePiece.left 
      && this.allPuzzlePieces[2][rowTwoRightIndex].bottom === puzzlePiece.right
      ) {
        return true;
      }
      else {
        return false;
      }
  }
      
  //SWITCH Functions
  //switches 2 puzzle pieces for any given row
  private switchRow(switchSpotIdx, toSwitchInIdx, rowNum) {
    
    let holdFirstPiece = this.allPuzzlePieces[rowNum][switchSpotIdx];
    this.allPuzzlePieces[rowNum][switchSpotIdx] = this.allPuzzlePieces[rowNum][toSwitchInIdx];
    this.allPuzzlePieces[rowNum][toSwitchInIdx] = holdFirstPiece;
  }
      
  
  // Permutation Functions: 
  
  //takes test spot, test piece, and record of current array setup (to reset the bankAvlbl)
  //generates whole soln subset - testing all first layer switchIns, even after a match
  private row1Perm(switchSpot, toSwitchIn, simpleNumArray) {
    //console.log('Row1: ' + switchSpot + " <-" + toSwitchIn);
    
    //default set to true - sets false if 1.doesn't fit | 2.no more perms
    let hasAvlblBranches = true;
    
    //reset bankAvlblPuzzlePieces[] to match simpleNumArray
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.allPuzzlePieces[1][i].id !== simpleNumArray[i])) {
        for (let j = i; j < 10; j++) {
          if (this.allPuzzlePieces[1][j].id === simpleNumArray[i]) {
            this.switchRow(i, j, 1);
          }
        }
      }
    }
    
    
    
    //checks if piece actually fits
    if (this.fitsRowOne(switchSpot, this.allPuzzlePieces[1][toSwitchIn])) {
      //checks if switch needs to be made (or already in place)
      if (switchSpot !== toSwitchIn) {
        this.switchRow(switchSpot, toSwitchIn, 1);
        let holdFirstPlace = simpleNumArray[switchSpot]; 
        simpleNumArray[switchSpot] = simpleNumArray[toSwitchIn];
        simpleNumArray[toSwitchIn] = holdFirstPlace;
      }
      //if switchSpot < 8, then it will continue branching
      //if switchSpot === 8, then it will check last cell to see if it's perfect row fit
      if (switchSpot === 8) {
        hasAvlblBranches = false;
        if (this.fitsRowOne(9, this.allPuzzlePieces[1][9])) {
          let simpleNumArray2 = [0,1,2,3,4,5,6,7,8,9];
          return this.row2Perm(0, 0, simpleNumArray2);
        }
      }
    }
    else {
      //or breaks out of all future branches/perms
      //because current piece does not fit
      hasAvlblBranches = false;
    }
    
    //explore all lower branches
    //begin permutation process on next available puzzle piece spot
    if (hasAvlblBranches) {
      let newSwitchSpot = switchSpot + 1;
      for (let i = newSwitchSpot; i < 10; i++) {
        this.row1Perm(newSwitchSpot, i, [...simpleNumArray]);
      }
    }
    //Call row1Perm to try ALL pieces in the current switchSpot
    //regardless of current match or not
    if (switchSpot === 0 && toSwitchIn === 0) { 
      for (let i = switchSpot + 1; i < 10; i++) {
        this.row1Perm(switchSpot, i, [...simpleNumArray]);
      }
    }
  }//end of row1Perm()
  
  
  
  //takes test spot, test piece, and record of current array setup (to reset the bankAvlbl)
  private row2Perm(switchSpot, toSwitchIn, simpleNumArray) {
    //console.log('Row2: ' + switchSpot + " <-" + toSwitchIn);
    
    //default set to true - sets false if 1.doesn't fit | 2.no more perms
    let hasAvlblBranches = true;
    
    //reset bankAvlblPuzzlePieces[] to match simpleNumArray
    for (let i = 0; i < 10; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.allPuzzlePieces[2][i].id !== simpleNumArray[i])) {
        for (let j = i; j < 10; j++) {
          if (this.allPuzzlePieces[2][j].id === simpleNumArray[i]) {
            this.switchRow(i, j, 2);
          }
        }
      }
    }
    
    //Call row2Perm to try ALL pieces in the current switchSpot
    //regardless of current match or not
    if (switchSpot === 0 && toSwitchIn === 0) {
      let newSwitchSpot = switchSpot;
      for (let i = switchSpot + 1; i < 10; i++) {
        this.row2Perm(switchSpot, i, [...simpleNumArray]);
      }
    }
    
    //checks if piece actually fits
    if (this.fitsRowTwo(switchSpot, this.allPuzzlePieces[2][toSwitchIn])) {
      //checks if switch needs to be made (or already in place)
      if (switchSpot !== toSwitchIn) {
        this.switchRow(switchSpot, toSwitchIn, 2);
        let holdFirstPlace = simpleNumArray[switchSpot]; 
        simpleNumArray[switchSpot] = simpleNumArray[toSwitchIn];
        simpleNumArray[toSwitchIn] = holdFirstPlace;
      }
      //if switchSpot < 8, then it will continue branching
      //if switchSpot == 8, then it will check last cell to see if it's perfect row fit
      if (switchSpot === 8) {
        hasAvlblBranches = false;
        if (this.fitsRowTwo(9, this.allPuzzlePieces[2][9])) {
          let simpleNumArray3 = [0,1,2,3,4];
          return this.row3Perm(0, 0, simpleNumArray3);
        }
      }
    }
    else {
      //or breaks out of all future branches/perms 
      //because current piece does not fit
      hasAvlblBranches = false;
    }
    
    //explore all lower branches
    //begin permutation process on next available puzzle piece spot
    if (hasAvlblBranches) {
      let newSwitchSpot = switchSpot + 1;
      for (let i = newSwitchSpot; i < 10; i++) {
        this.row2Perm(newSwitchSpot, i, [...simpleNumArray]);
      }
    }
  }//end of row2Perm()
  
  
  
  //takes test spot, test piece, and record of current array setup (to reset the bankAvlbl)
  private row3Perm(switchSpot, toSwitchIn, simpleNumArray) {
    //console.log(switchSpot + " <--" + toSwitchIn);
    
    //default set to true - sets false if 1.doesn't fit | 2.no more perms
    let hasAvlblBranches = true;
    
    //reset bankAvlblPuzzlePieces[] to match simpleNumArray
    for (let i = 0; i < 5; i++) {
      //if bankAvlbl piece is already in position, skip to next index
      //if not equal, run through bankAvlbl[] to find match & switch
      if ((this.allPuzzlePieces[3][i].id !== simpleNumArray[i])) {
        for (let j = i; j < 5; j++) {
          if (this.allPuzzlePieces[3][j].id === simpleNumArray[i]) {
            this.switchRow(i, j, 3);
          }
        }
      }
    }
    
    //Call row3Perm to try ALL pieces in the current switchSpot
    //regardless of current match or not
    if (switchSpot === 0 && toSwitchIn === 0) {
      let newSwitchSpot = switchSpot;
      for (let i = switchSpot + 1; i < 5; i++) {
        this.row3Perm(switchSpot, i, [...simpleNumArray]);
      }
    }
    
    //checks if piece actually fits
    if (this.fitsRowThree(switchSpot, this.allPuzzlePieces[3][toSwitchIn])) {
      //checks if switch needs to be made (or already in place)
      if (switchSpot !== toSwitchIn) {
        this.switchRow(switchSpot, toSwitchIn, 3);
        let holdFirstPlace = simpleNumArray[switchSpot]; 
        simpleNumArray[switchSpot] = simpleNumArray[toSwitchIn];
        simpleNumArray[toSwitchIn] = holdFirstPlace;
      }
      //if switchSpot < 3, then it will continue branching
      //if switchSpot == 3, then it will check last cell to see if it's perfect fit
      if (switchSpot === 3) {
        hasAvlblBranches = false;
        if (this.fitsRowThree(4, this.allPuzzlePieces[3][4])) {
          this.cementSolvedArray();
          return true;
        }
      }
    }
    else {
      //or breaks out of all future branches/perms
      //because current piece does not fit
      hasAvlblBranches = false;
    }
    
    //explore all lower branches
    //begin permutation process on next available puzzle piece spot
    if (hasAvlblBranches) {
      let newSwitchSpot = switchSpot + 1;
      for (let i = newSwitchSpot; i < 5; i++) {
        this.row3Perm(newSwitchSpot, i, [...simpleNumArray]);
      }
    }
  }//end of row3Perm()
  

  private cementSolvedArray() {
    //create a new array to store solution from working copy in bankAvlblPuzzlePieces
    const solvedPuzzlePieces = new Array(3);
    solvedPuzzlePieces[0] = new Array(10);
    solvedPuzzlePieces[1] = new Array(10);
    solvedPuzzlePieces[2] = new Array(5);
    for (let i = 0; i < 10; i++) {
      solvedPuzzlePieces[0][i] = this.allPuzzlePieces[1][i].id;
    }
    for (let i = 0; i < 10; i++) {
      solvedPuzzlePieces[1][i] = this.allPuzzlePieces[2][i].id;
    }
    for (let i = 0; i < 5; i++) {
      solvedPuzzlePieces[2][i] = this.allPuzzlePieces[3][i].id;
    }

    //currently unnecessary, but confirms each new solution is unique
    const  alreadyExists = () => {
      outer_loop: for (let i = 0; i < this.allSolvedPuzzlePieces.length; i++) {

        for (let j = 0; j < 10; j++) {
          if (this.allSolvedPuzzlePieces[i][0][j] !== solvedPuzzlePieces[0][j]) continue outer_loop;
          if (this.allSolvedPuzzlePieces[i][1][j] !== solvedPuzzlePieces[1][j]) continue outer_loop;

          if (j < 5) {
            if (this.allSolvedPuzzlePieces[i][2][j] !== solvedPuzzlePieces[2][j]) continue outer_loop;
          }
        }
        return true;
      }
    }

    //push immediately to allSolvedPuzzlePieces if first solution
    //or push after solution is confirmed unique
    if (this.allSolvedPuzzlePieces.length === 0) {
      console.log('     perfect fit!');
      this.allSolvedPuzzlePieces.push(solvedPuzzlePieces);
    }
    else if (!alreadyExists()) {
      //console.log('     perfect fit!');
      this.allSolvedPuzzlePieces.push(solvedPuzzlePieces);
    }
  } //end of cementSolvedArray()

} //end of class