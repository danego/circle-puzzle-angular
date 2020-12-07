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
  droppedPieceData = new Subject<{ layer: number, position: number, pieceId: number }>();

  transferAllToBank() {
    this.moveAllPieces.next('toBank');
  }
  transferAllToCircle() {
    this.moveAllPieces.next('toCircle');
  }

  droppedUpdatePiecesById(layer: number, position: number, pieceId: number) {
    // here => bankCircleConnector => CircleComponent (update piecesByID) => solutionsGrabber (run soln comparison)
    this.droppedPieceData.next({
      layer: layer,
      position: position,
      pieceId: pieceId
    });
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
}
