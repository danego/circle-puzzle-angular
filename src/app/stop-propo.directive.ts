/* 
 * This directive stops click propagation
 * It is placed on the Hourglass Icon element, so as to not click & start timer underneath
 */

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropo]'
})

export class StopPropoDirective {

  @HostListener('click', ['$event']) onClick(event?) {
    event.stopPropagation();
  }

  constructor() {}
}
