/* 
 * This directive stops click propagation
 * It is placed on the DropList elements, so as to not click & toggle Piece Bank visibility underneath
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
