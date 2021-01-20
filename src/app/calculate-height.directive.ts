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
  //     - would have to minimize puzzle first for smaller screen
  //@HostListener('window:resize') onResize() {
  //  this.pieceSizingService.setNewFontSizeFactor(2); 
  //  this.calculateHeight();
  //}

  constructor(private elementRef: ElementRef, private pieceSizingService: PieceSizingService) {}

  ngAfterViewInit() {
    this.calculateHeight();
  }
  
  calculateHeight() {
    const currentHeight = this.elementRef.nativeElement.offsetHeight;
    const currentWidth = this.elementRef.nativeElement.offsetWidth;

    this.pieceSizingService.setNewContainerHeight(
      currentWidth,
      currentHeight,
      this.determineLayout(currentWidth, currentHeight)
    );
  }

  determineLayout(width, height) {
    //either 'vertical', 'mixed', or 'vertical'
    let layout: string;

    //mobile to tablet
    if (width < 1000 || height < 600) {
      if (width > 700) {
        layout = 'layout-mixed';
      }
      else {
        layout = 'layout-vertical';
      }
    }
    //laptop to ultra
    else {
      layout = 'layout-horizontal'; 
    }

    return layout;
  }
}