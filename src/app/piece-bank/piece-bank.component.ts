import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'piece-bank',
  templateUrl: './piece-bank.component.html',
  styleUrls: ['./piece-bank.component.css']
})
export class PieceBankComponent implements OnInit {
  piecesBank1: any[];
  piecesBank2: any[];
  piecesBank3: any[];
  isDragging: boolean = false;
  displayBankOne: boolean = false;
  displayBankTwo: boolean = false;
  displayBankThree: boolean = false;


  constructor() { }

  ngOnInit(): void {
    this.piecesBank1 = new Array(2);
    this.piecesBank1[0] = {top:'P', left:'G', right:'G'};
    this.piecesBank1[1] = {top:'P', left:'O', right:'G'};

    this.piecesBank2 = new Array(2);
    this.piecesBank2[0] = {left:'P', right:'P', bottom:'G'};
    this.piecesBank2[1] = {left:'G', right:'G', bottom:'O'};

    this.piecesBank3 = new Array(1);
    this.piecesBank3[0] = {left:'O', right:'P'};

  }

  dropped(event: CdkDragDrop<string[]>) {
    //move to new, dropped list, only if empty
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  dragStarted(layer: number) {
    if (layer === 1) {
      this.isDragging = true;
    }
    /*
    else if (layer === 2) {
      this.isDragging2 = true;
    }
    else {
      this.isDragging3 = true;
    }
    */
  }
  dragEnded(layer: number) {
    if (layer === 1) {
      this.isDragging = false;
    }
  }
}
