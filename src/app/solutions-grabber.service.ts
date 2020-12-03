import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SolutionsGrabberService {
  allPuzzlePieces = new Array(4);


  constructor() {
    console.log('service cctor');
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
  }
}