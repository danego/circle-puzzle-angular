import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BankCircleConnectorService {
  private bankPiecesArray = [];
  private circlePiecesArray = [];
  isDragging = new Subject<{ layer: number, enabled: boolean }>();
  moveAllPieces = new Subject<string>(); //emits either 'toBank' or 'toCircle'

  transferAllToBank() {
    this.moveAllPieces.next('toBank');
  }
  transferAllToCircle() {
    this.moveAllPieces.next('toCircle');
  }

  dragStarted(layer: number) {
    this.isDragging.next({
      layer: layer,
      enabled: true
    });
  }

  dragEnded(layer: number) {
    this.isDragging.next({
      layer: layer,
      enabled: false
    });
  }

  //PSUEDO CODE 
  /* 
  - this service needs to be aware of current dropList values, both in Bank & Circle

    - Could update in service each time those change in components
    - Could ref link the two arrays (prob might occur after first transfer)

    - Can pass in all values of arrays to call of service method()
      - So we press button in AppControlPanel
      - emit subjectListener from service to both Bank & Circle Components
      - then in their listeners, they send current array data
      - that method call should return new values for array (or order of their simpleNums) 

      - FIRST create solutions service to store all default puzzle pieces with their own index/ID
      - then when repopulating the arrays/displays (init, allMoved^), reach out to this service to re-setup the values (ie reach out to this service only at beginning)
  */
}
