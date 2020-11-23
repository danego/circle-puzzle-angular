import { Directive, ElementRef, HostBinding, Input, OnInit } from "@angular/core";

@Directive({
  selector: '[positionByDegree]'
})


export class PositionDirective implements OnInit {

  //input name must be same as selector ...
  @Input('positionByDegree') circleSize: string; //replace this with own input, don;t piggyback on selector!
  @Input('circleHeight') circleHeight: string;

  
  //@HostBinding('id') name: string;
  @HostBinding('style.top') top: string;
  @HostBinding('style.bottom') bottom: string;
  @HostBinding('style.left') left: string;
  @HostBinding('style.right') right: string;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.top = '90px';
    this.left = '90px';

    console.log(this.circleSize);
    const fullID = this.circleSize;
    const fullIDArray = fullID.split("");
    const layer = fullIDArray[0];
    const piece = +fullIDArray[1];
    console.log(layer);
    console.log(piece);

    console.log(this.circleHeight);
    
    const triangleDegrees = this.convertToAngleDegrees(piece);
    this.convertToAngleCssCartesian(triangleDegrees);

    /*
    console.log(this.element.nativeElement.id);
    const fullID = this.element.nativeElement.id;
    const fullIDArray = fullID.split("");
    const layer = fullIDArray[0];
    const piece = fullIDArray[1];
    console.log(layer);
    console.log(piece);
    */
  }

  convertToAngleDegrees(piece: number) {
    //36deg between each piece bc 10 pieces in layer1
    //first piece is at 18deg, not 0deg
    const degrees = ((piece + 1) * 36) - 18;

    //triangle degrees is the angle between hypotenuse and X-axis
    let triangleDegrees;
    if (piece <= 2) {
      triangleDegrees = degrees;
    }
    else if (piece > 2 && piece <= 4) {
      triangleDegrees = 180 - degrees;
    }
    else if (piece > 4 && piece <= 7) {
      triangleDegrees = degrees - 180;
    }
    else { //pieces 8, 9
      triangleDegrees = 360 - degrees;
    }

    return triangleDegrees;
  }

  convertToAngleCssCartesian(triangleDegrees: number) {
    //should recieve quadrant number. just use same if/else as above

    //then use cos,sin to find leg lengths

    //then use CircleHeight (service?, second input?) to set bottom/top & left/right values
  }
}




  //might need to be [ngStyle]
  //OR percentages  
  //BC problem of circle radius/width 
  //inputs to directive or ... do it all in the component with renderer2 & local elements

  //separate directives for the diff layers? 
  //or include more logic in this single directive?
  // ^ in which case, no need to split input, just use index
  