import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PieceSizingService {
  pieceSizesByEm = {
    pieceOne: {
      width: 17,
      height: 7.6,
      bankWidth: 17
    },
    pieceTwo: {
      width: 10,
      height: 7.6,
      bankWidth: 20
    },
    pieceThree: {
      width: 10.5,
      height: 4,
      bankWidth: 10.5
    }
  };

  //private fontSize: number = 10;
  //fontSizeFactor = new BehaviorSubject<number>(this.fontSize);
  fontSizeFactor = new Subject<number>();
  fontSizeForPieces = new Subject<number>();
  containerSize = new ReplaySubject<number>(1);
  minBankSize = new Subject<number>();
  currentLayout = new Subject<string>();
  pieceSizes = new BehaviorSubject<object>({...this.pieceSizesByEm});

  //NOTE: now we get containerSmallSide and layout style 
  // - calculate based off control panel width/height and pieceBanks (accounting for dynamic piece width w/in)

  setNewContainerHeight(newContainerWidth: number, newContainerHeight: number, layoutStyle: string) {
    //Timeout to avoid angular 'already checked' error
    window.setTimeout(() => {
      let containerLimitingSize = this.calculateCircleSize(newContainerWidth, newContainerHeight, layoutStyle);

      //used for circle and piece sizing
      const newFontSizeFactor = this.setNewFontSizeFactor(containerLimitingSize);
      this.fontSizeFactor.next(newFontSizeFactor);
      this.setNewFontSizeForPieces(newFontSizeFactor);


      //used for pieceBank container
      this.setNewContainerSizeForBank(containerLimitingSize, newContainerHeight, layoutStyle, newFontSizeFactor);

      this.currentLayout.next(layoutStyle);

      this.pieceSizes.next({...this.pieceSizesByEm});
    }, 0);
  }

  private calculateCircleSize(newContainerWidth: number, newContainerHeight: number, layoutStyle: string) {
    let pieceBankStartingWidth = 232;
    let pieceBankXMargin;
    let controlPanelWidth = 250;
    let circleSize;

    if (layoutStyle === 'layout-vertical') {
      circleSize = newContainerWidth;
    }
    else {
      if (layoutStyle === 'layout-mixed') {
        //margin only right
        pieceBankXMargin = 10;
        controlPanelWidth = 0;
        circleSize = newContainerWidth - pieceBankStartingWidth - pieceBankXMargin;
      }
      else if (layoutStyle === 'layout-horizontal') {
        //margin both left & right
        pieceBankXMargin = 20;
        circleSize = newContainerWidth - pieceBankStartingWidth - pieceBankXMargin - controlPanelWidth;
      }

      const newFontSizeFactor = this.setNewFontSizeFactor(circleSize);
      const minPieceBankSize = Math.ceil(newFontSizeFactor * this.pieceSizesByEm.pieceTwo.width * 2);

      //232px - 40px (for padding)
      if (minPieceBankSize > (pieceBankStartingWidth - 40)) {
        const pieceBankMinPadding = 40;
        const newPieceBankWidth = Math.ceil(newFontSizeFactor * this.pieceSizesByEm.pieceTwo.width * 2) + pieceBankMinPadding;

        circleSize = newContainerWidth - newPieceBankWidth - pieceBankXMargin - controlPanelWidth;
        this.minBankSize.next(newPieceBankWidth);
      }
    }
   
    //check if height is limiting factor
    if (circleSize > newContainerHeight) {
      circleSize = newContainerHeight; 
    }
    //max circle size = 1200px / 15 fontSizeFactor
    if (circleSize > 1200) {
      circleSize = 1200;
    }

    return circleSize;
  }

  //used to dynamically size all of puzzle using ems
  private setNewFontSizeFactor(newContainerHeight: number): number {
    const startingCircleHeightFactor = 800;
    const startingFontSizeFactor = 10;
    let newFontSizeFactor = +(newContainerHeight / startingCircleHeightFactor * startingFontSizeFactor).toFixed(3);

    //set max/min 
    if (newFontSizeFactor > 15) newFontSizeFactor = 15;
    else if (newFontSizeFactor < 3.5) newFontSizeFactor = 3.5;

    return newFontSizeFactor;
  }
  
  //used to set actual font size for text on puzzle pieces
  private setNewFontSizeForPieces(fontSizeFactor: number) {
    //because startingFontSizeFactor == 10px and relative font size to that is 15px
    const fontSizeConversion = 1.5;
    const fontSizeForPiecesText = +(fontSizeFactor * fontSizeConversion).toFixed(2);
    this.fontSizeForPieces.next(fontSizeForPiecesText);
  }

  private setNewContainerSizeForBank(containerSize: number, containerHeight: number, layoutStyle: string, fontSizeFactor: number) {
    // double up piece columns if space is available
    if (layoutStyle === 'layout-vertical' || layoutStyle === 'layout-mixed') {
      this.setBankWidthsForRepeats(fontSizeFactor);
    }

    if (layoutStyle === 'layout-vertical') {
      //set bankHeight to fill remaining vertical space
      let bankHeight = containerHeight - containerSize;
      if (bankHeight > containerSize * 2 / 3) bankHeight = Math.floor(containerSize * 2 / 3);
      if (bankHeight < 200) bankHeight = 200;
      this.containerSize.next(bankHeight);
    }
    else {
      this.containerSize.next(containerSize);
    }
  }

  private setBankWidthsForRepeats(fontSizeFactor: number) {
    //set width for each layer
    let pieceBankInnerWidth = 192;  //232px - 40px (for padding)
    // Layer One
    let pieceOneWholeRepeats = Math.floor(pieceBankInnerWidth / (this.pieceSizesByEm.pieceOne.width * fontSizeFactor));
    if (pieceOneWholeRepeats > 3) pieceOneWholeRepeats = 3;
    this.pieceSizesByEm.pieceOne.bankWidth = pieceOneWholeRepeats * this.pieceSizesByEm.pieceOne.width;
    // Layer Two
    let pieceTwoWholeRepeats = Math.floor(pieceBankInnerWidth / (this.pieceSizesByEm.pieceTwo.width * fontSizeFactor));
    if (pieceTwoWholeRepeats > 3) pieceTwoWholeRepeats = 3;
    this.pieceSizesByEm.pieceTwo.bankWidth = pieceTwoWholeRepeats * this.pieceSizesByEm.pieceTwo.width;
    // Layer Three
    let pieceThreeWholeRepeats = Math.floor(pieceBankInnerWidth / (this.pieceSizesByEm.pieceThree.width * fontSizeFactor));
    if (pieceThreeWholeRepeats > 2) pieceThreeWholeRepeats = 2;
    this.pieceSizesByEm.pieceThree.bankWidth = pieceThreeWholeRepeats * this.pieceSizesByEm.pieceThree.width;
  }
}