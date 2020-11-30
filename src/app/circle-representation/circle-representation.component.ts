import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-circle-representation',
  templateUrl: './circle-representation.component.html',
  styleUrls: ['./circle-representation.component.css']
})
export class CircleRepresentationComponent implements OnInit {
  pieces: any[][];

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


    this.pieces[2] = [
      {left:'G', right:'P', bottom:'O'},
      {left:'O', right:'G', bottom:'P'},
      {left:'P', right:'O', bottom:'P'},
      {left:'O', right:'P', bottom:'G'},
      {left:'G', right:'O', bottom:'O'},
      {left:'P', right:'G', bottom:'G'},
      {left:'P', right:'O', bottom:'G'},
      {left:'O', right:'O', bottom:'P'},
      {left:'P', right:'P', bottom:'G'},
      {left:'G', right:'G', bottom:'O'}
    ];
    this.pieces[3] = [  //note: this is updated
      {left:'P', right:'G'}, 
      {left:'O', right:'G'}, 
      {left:'G', right:'P'}, 
      {left:'G', right:'O'}, 
      {left:'O', right:'P'},
    ];
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
}
