import { 
  Directive, 
  ElementRef, 
  AfterViewInit, 
  HostListener, 
} from '@angular/core';

import { PieceSizingService } from './piece-sizing.service';
 

@Directive({
  selector: "[calculateHeight]"
})

export class CalculateHeightDirective implements AfterViewInit {

  //note - only works when moving to bigger size.
  //     - would have to minimize puzzle first if smaller screen
  //@HostListener('window:resize') onResize() {
  //  this.pieceSizingService.setNewFontSizeFactor(2); 
  //  this.calculateHeight();
  //}

  constructor(private elementRef: ElementRef, private pieceSizingService: PieceSizingService) {}

  ngAfterViewInit() {
    this.calculateHeight();
  }

  calculateHeight() {
    const startingCircleHeightFactor = 800;
    const startingFontSizeFactor = 10;
    
    const currentHeight = this.elementRef.nativeElement.offsetHeight;
    const newFontSizeFactor = +(currentHeight / startingCircleHeightFactor * startingFontSizeFactor).toFixed(2);
    
    this.pieceSizingService.setNewFontSizeFactor(newFontSizeFactor);
    this.pieceSizingService.setNewContainerHeight(currentHeight);
  }
}