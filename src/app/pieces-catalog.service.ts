import { Injectable } from '@angular/core';

@Injectable ({
  providedIn: 'root'
})

export class PiecesCatalogService {

  private allPuzzlePieces: any[][] = new Array(4);

  getPiecesForSelectedPattern(pattern?: string) {
    if (pattern === 'atlantis') {
      this.setPiecesToAtlantis();
    }
    else if (pattern === 'egypt') {
      this.setPiecesToEgypt();
    }
    else {
      this.setPiecesToPlanets();
    }

    return this.makeDeepCopy();
  }

  private makeDeepCopy() {
    let cleanPuzzlePieces = new Array(4);
    cleanPuzzlePieces[0] = [...this.allPuzzlePieces[0]];

    //layer zero is array of primitives so no references and no need to use spread
    for (let i = 1; i < 4; i++) {
      cleanPuzzlePieces[i] = [];
      for (let j = 0; j < this.allPuzzlePieces[i].length; j++) {
        cleanPuzzlePieces[i][j] = {...this.allPuzzlePieces[i][j]};
      }
    }
    return cleanPuzzlePieces;
  }

  private setPiecesToPlanets() {
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

  private setPiecesToEgypt() {
    this.allPuzzlePieces[0] = ['T', 'T', 'P', 'R', 'R', 'T', 'P', 'T', 'R', 'P'];
    this.allPuzzlePieces[1] = [
      {top:'T', left:'O', right:'T', id: 0},
      {top:'T', left:'P', right:'O', id: 1},
      {top:'P', left:'O', right:'T', id: 2},
      {top:'R', left:'P', right:'P', id: 3},
      {top:'R', left:'T', right:'T', id: 4},
      {top:'T', left:'O', right:'O', id: 5},
      {top:'P', left:'P', right:'T', id: 6},
      {top:'T', left:'T', right:'P', id: 7},
      {top:'R', left:'P', right:'O', id: 8},
      {top:'P', left:'T', right:'P', id: 9}
    ];
    this.allPuzzlePieces[2] = [
      {left:'P', right:'O', bottom:'T', id: 0},
      {left:'T', right:'P', bottom:'R', id: 1},
      {left:'O', right:'O', bottom:'P', id: 2},
      {left:'T', right:'P', bottom:'T', id: 3},
      {left:'P', right:'T', bottom:'R', id: 4},
      {left:'T', right:'O', bottom:'R', id: 5},
      {left:'O', right:'P', bottom:'P', id: 6},
      {left:'T', right:'T', bottom:'R', id: 7},
      {left:'P', right:'P', bottom:'T', id: 8},
      {left:'O', right:'T', bottom:'P', id: 9}
    ];
    this.allPuzzlePieces[3] = [
      {left:'P', right:'R', id: 0}, 
      {left:'T', right:'R', id: 1}, 
      {left:'R', right:'P', id: 2}, 
      {left:'R', right:'T', id: 3},
      {left:'P', right:'T', id: 4}
    ];
  }

  private setPiecesToAtlantis() {
    this.allPuzzlePieces[0] = ['B', 'B', 'AU', 'S', 'S', 'B', 'AU', 'B', 'S', 'AU'];
    this.allPuzzlePieces[1] = [
      {top:'B', left:'S', right:'C', id: 0},
      {top:'B', left:'C', right:'B', id: 1},
      {top:'AU', left:'B', right:'S', id: 2},
      {top:'S', left:'B', right:'B', id: 3},
      {top:'S', left:'S', right:'C', id: 4},
      {top:'B', left:'B', right:'S', id: 5},
      {top:'AU', left:'S', right:'B', id: 6},
      {top:'B', left:'C', right:'C', id: 7},
      {top:'S', left:'S', right:'S', id: 8},
      {top:'AU', left:'C', right:'B', id: 9}
    ];
    this.allPuzzlePieces[2] = [
      {left:'S', right:'B', bottom:'AU', id: 0},
      {left:'B', right:'S', bottom:'C', id: 1},
      {left:'C', right:'B', bottom:'B', id: 2},
      {left:'S', right:'S', bottom:'C', id: 3},
      {left:'B', right:'C', bottom:'AU', id: 4},
      {left:'C', right:'S', bottom:'B', id: 5},
      {left:'S', right:'C', bottom:'C', id: 6},
      {left:'B', right:'S', bottom:'AU', id: 7},
      {left:'C', right:'C', bottom:'B', id: 8},
      {left:'B', right:'B', bottom:'AU', id: 9}
    ];
    this.allPuzzlePieces[3] = [
      {left:'AU', right:'C', id: 0}, 
      {left:'B', right:'C', id: 1}, 
      {left:'AU', right:'B', id: 2}, 
      {left:'C', right:'AU', id: 3},
      {left:'B', right:'AU', id: 4}
    ];
  }
}