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
  }

}
