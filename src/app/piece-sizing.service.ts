import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PieceSizingService {

  //private fontSize: number = 10;
  //fontSizeFactor = new BehaviorSubject<number>(this.fontSize);
  fontSizeFactor = new Subject<number>();
  fontSizeForPieces = new Subject<number>();
  containerSize = new Subject<number>();

  setNewContainerHeight(newContainerHeight) {
    //Timeout to avoid angular 'already checked' error
    window.setTimeout(() => {
      //used for circle and piece sizing
      const newFontSizeFactor = this.setNewFontSizeFactor(newContainerHeight);
      this.setNewFontSizeForPieces(newFontSizeFactor);

      //used for pieceBank container
      this.containerSize.next(newContainerHeight);
    }, 0)
  }

  //used to dynamically size all of puzzle using ems
  setNewFontSizeFactor(newContainerHeight: number): number {
    const startingCircleHeightFactor = 800;
    const startingFontSizeFactor = 10;
    const newFontSizeFactor = +(newContainerHeight / startingCircleHeightFactor * startingFontSizeFactor).toFixed(2);

    //this.fontSize = newFontSize;
    this.fontSizeFactor.next(newFontSizeFactor);
    return newFontSizeFactor;
  }
  
  //used to set actual font size for text on puzzle pieces
  setNewFontSizeForPieces(fontSizeFactor: number) {
    //because startingFontSizeFactor == 10px and relative font size to that is 15px
    const fontSizeConversion = 1.5;
    const fontSizeForPiecesText = +(fontSizeFactor * fontSizeConversion).toFixed(2);
    this.fontSizeForPieces.next(fontSizeForPiecesText);
  }
}