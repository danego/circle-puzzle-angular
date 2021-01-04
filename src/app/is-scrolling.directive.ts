import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: "[isScrolling]"
})

export class IsScrollingDirective {

  @HostListener('scroll') onScroll() {
    console.log('scrolling');
  }
  
}