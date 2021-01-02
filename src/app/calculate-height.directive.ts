import { 
  Directive, 
  HostBinding, 
  ElementRef, 
  AfterViewInit, 
  HostListener, 
  OnInit, 
  AfterContentInit 
} from '@angular/core';

import { PieceSizingService } from './piece-sizing.service';
 

@Directive({
  selector: "[calculateHeight]"
})

export class CalculateHeightDirective implements OnInit, AfterViewInit, AfterContentInit {

  //@HostListener('window:resize') onResize() {
  //  this.calculateHeight();
  //}

  constructor(private elementRef: ElementRef, private pieceSizingService: PieceSizingService) {}

  ngOnInit() {
    
  }
  
  ngAfterContentInit() {
    const currentHeight = this.elementRef.nativeElement.offsetHeight;
    console.log('aftercontentinit ' + currentHeight);
  }

  ngAfterViewInit() {
    const startingCircleHeightFactor = 800;
    const startingFontSizeFactor = 10;
    
    const currentHeight = this.elementRef.nativeElement.offsetHeight;
    const newFontSizeFactor = +(currentHeight / startingCircleHeightFactor * startingFontSizeFactor).toFixed(2);
    
    console.log(currentHeight);
    console.log(newFontSizeFactor);
    this.pieceSizingService.setNewFontSizeFactor(newFontSizeFactor);
  }
}