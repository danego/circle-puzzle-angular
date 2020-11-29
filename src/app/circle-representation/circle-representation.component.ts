import { Component, OnInit } from '@angular/core';

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
    this.pieces[1] = [
      {top:'G', left:'P', right:'O'},
      {top:'G', left:'G', right:'P'},
      {top:'G', left:'O', right:'G'},
      {top:'G', left:'P', right:'P'},
      {top:'G', left:'O', right:'O'},
      {top:'P', left:'P', right:'O'},
      {top:'P', left:'O', right:'P'},
      {top:'P', left:'G', right:'P'},
      {top:'P', left:'O', right:'G'},
      {top:'P', left:'G', right:'G'}
    ];
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

}
