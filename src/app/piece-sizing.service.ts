import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PieceSizingService {

  private fontSize: number = 10;

  //fontSizeFactor = new BehaviorSubject<number>(this.fontSize);
  fontSizeFactor = new Subject<number>();

  setNewFontSizeFactor(newFontSize: number) {
    this.fontSize = newFontSize;
    this.fontSizeFactor.next(newFontSize);
  }
}