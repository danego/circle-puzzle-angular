import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-circle-representation',
  templateUrl: './circle-representation.component.html',
  styleUrls: ['./circle-representation.component.css']
})
export class CircleRepresentationComponent implements OnInit {
  pieces: any[][];
  piecesBank1: any[];

  isDragging1: boolean = false;
  isDragging2: boolean = false;
  isDragging3: boolean = false;

  constructor() { }

  ngOnInit() {
    this.pieces = new Array(4);
    this.pieces[0] = ['G', 'G', 'G', 'P', 'P', 'P', 'G', 'G', 'P', 'P'];


    //each piece should be in its own array for drag-&-drop
    this.pieces[1] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[1][i] = [];
    }
    //array[layer][d&d/piece][actual piece]
    this.pieces[1][0][0] = {top:'G', left:'P', right:'O'};
    this.pieces[1][1][0] = {top:'G', left:'G', right:'P'};
    this.pieces[1][2][0] = {top:'G', left:'O', right:'G'};
    this.pieces[1][3][0] = {top:'G', left:'P', right:'P'};
    this.pieces[1][4][0] = {top:'G', left:'O', right:'O'};
    //this.pieces[1][5][0] = {top:'P', left:'P', right:'O'};
    //this.pieces[1][6][0] = {top:'P', left:'O', right:'P'};
    //this.pieces[1][7][0] = {top:'P', left:'G', right:'P'};
    //this.pieces[1][8][0] = {top:'P', left:'O', right:'G'};
    //this.pieces[1][9][0] = {top:'P', left:'G', right:'G'};  

    this.piecesBank1 = [
      {top:'P', left:'G', right:'G'}
    ];


    //LAYER TWO
    this.pieces[2] = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.pieces[2][i] = [];
    }
    //array[layer][d&d/piece][actual piece]
    this.pieces[2][0][0] = {left:'G', right:'P', bottom:'O'};
    this.pieces[2][1][0] = {left:'O', right:'G', bottom:'P'};
    this.pieces[2][2][0] = {left:'P', right:'O', bottom:'P'};
    this.pieces[2][3][0] = {left:'O', right:'P', bottom:'G'};
    this.pieces[2][4][0] = {left:'G', right:'O', bottom:'O'};
    this.pieces[2][5][0] = {left:'P', right:'G', bottom:'G'};
    this.pieces[2][6][0] = {left:'P', right:'O', bottom:'G'};
    //this.pieces[2][7][0] = {left:'O', right:'O', bottom:'P'};
    //this.pieces[2][8][0] = {left:'P', right:'P', bottom:'G'};
    //this.pieces[2][9][0] = {left:'G', right:'G', bottom:'O'};


    //LAYER THREE
    this.pieces[3] = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.pieces[3][i] = [];
    }
    this.pieces[3][0][0] = {left:'P', right:'G'}; 
    this.pieces[3][1][0] = {left:'O', right:'G'}; 
    this.pieces[3][2][0] = {left:'G', right:'P'}; 
    this.pieces[3][3][0] = {left:'G', right:'O'}; 
    //this.pieces[3][4][0] = {left:'O', right:'P'};
    
  }

  dropped(event: CdkDragDrop<string[]>) {
    //move to new, dropped list, only if empty
    if (event.container.data.length === 0) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
        );
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
  }
}
