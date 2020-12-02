import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'piece-bank',
  templateUrl: './piece-bank.component.html',
  styleUrls: ['./piece-bank.component.css']
})
export class PieceBankComponent implements OnInit {
  piecesBank1 = [];

  constructor() { }

  ngOnInit(): void {
    this.piecesBank1 = [
      {top:'P', left:'G', right:'G'}
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
