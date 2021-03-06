import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SolutionsGrabberService } from './solutions-grabber.service';

@Injectable({
  providedIn: 'root',
})

export class BankCircleConnectorService {

  isDraggingFromBank = new Subject<{ layer: number, enabled: boolean }>();
  isDraggingFromCircle = new Subject<{ layer: number, enabled: boolean }>();
  moveAllPieces = new Subject<string>(); //emits either 'toBank' or 'toCircle'
  droppedPieceData = new Subject<{ layer: number, position: number, pieceId: number }>();
  pieceDroppedInCircle = new Subject<number>();
  displayColorLetters = new Subject<boolean>();
  enableAutoOpen = new Subject<boolean>();
  scrollZonesEnabled = new Subject<boolean>();

  constructor(private solutionsGrabberService: SolutionsGrabberService) {}

  transferAllToBank() {
    this.solutionsGrabberService.moveAllPieces('toBank');
    this.moveAllPieces.next('toBank');
  }
  
  transferAllToCircle(solutionNumber?: number) {
    if (solutionNumber || solutionNumber === 0) {
      this.solutionsGrabberService.moveAllPieces('toCircle', solutionNumber);
    }
    else {
      this.solutionsGrabberService.moveAllPieces('toCircle');
    }
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

  droppedInCircle(layer: number) {
    this.pieceDroppedInCircle.next(layer);
  }

  dragStartedFromBank(layer: number) {
    this.isDraggingFromBank.next({
      layer: layer,
      enabled: true
    });
  }

  dragStartedFromCircle(layer: number) {
    this.isDraggingFromCircle.next({
      layer: layer,
      enabled: true
    });
  }

  dragEndedFromBank(layer: number) {
    this.isDraggingFromBank.next({
      layer: layer,
      enabled: false
    });
  }

  dragEndedFromCircle(layer: number) {
    this.isDraggingFromCircle.next({
      layer: layer,
      enabled: false
    });
  }

  toggleColorLetters(enabled: boolean) {
    this.displayColorLetters.next(enabled);
  }

  toggleAutoOpen(enabled: boolean) {
    this.enableAutoOpen.next(enabled);
  }

  toggleScrollZones(enabled: boolean) {
    this.scrollZonesEnabled.next(enabled);
  }
}
