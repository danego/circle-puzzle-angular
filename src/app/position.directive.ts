import { Directive, ElementRef, HostBinding, Input, OnInit } from "@angular/core";

@Directive({
  selector: '[positionByDegree]'
})


export class PositionDirective implements OnInit {
  circleRadius: number;

  //input name must be same as selector ...
  @Input('positionByDegree') circleSize: string; //replace this with own input, don;t piggyback on selector!
  @Input('circleHeight') circleHeight: string;
  @Input('pieceWidth') pieceWidth: string;
  @Input('pieceHeight') pieceHeight: string;

  
  //@HostBinding('id') name: string;
  @HostBinding('style.top') top: string;
  @HostBinding('style.bottom') bottom: string;
  @HostBinding('style.left') left: string;
  @HostBinding('style.right') right: string;
  //add to this
  @HostBinding('style.transform') rotate: string;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    //console.log(this.circleSize);
    const fullID = this.circleSize;
    const fullIDArray = fullID.split(" ");
    const layer = fullIDArray[0];
    const piece = +fullIDArray[1];

    this.circleRadius = +this.circleHeight / 2;
    
    this.convertToAngleCssCartesian(this.convertToAngleDegrees(layer, piece), piece);

    this.generateRotateDegrees(piece);
  }

  convertToAngleDegrees(layer: string, piece: number) {
    //36deg between each piece bc 10 pieces in layer1
    //first piece is at 18deg, not 0deg
    let degrees;
    if (layer === 'top') {
      degrees = ((piece + 1) * 36) - 18;
    }
    else if (layer === 'left') {
      degrees = ((piece) * 36);
    }

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

    //console.log(triangleDegrees);
    return triangleDegrees;
  }

  //takes the degree of triangle to X axis and the piece # to determine quadrant
// ACCOUNT FOR SIZE OF PIECE AND DIRECCTION IT'S COMING FROM, LEFTvsRIGHT
  convertToAngleCssCartesian(triangleDegrees: number, piece: number) {
    //use cos,sin to find leg lengths
    const xLeg = +this.getCosFromDegrees(triangleDegrees).toFixed(3);
    const yLeg = +this.getSinFromDegrees(triangleDegrees).toFixed(3);
    
    let accountForPieceX: number, accountForPieceY: number;
    accountForPieceX = +this.pieceWidth / 2;
    accountForPieceY = +this.pieceHeight / 2;
  


    const xLegPlusCircle = this.circleRadius * this.getCosFromDegrees(triangleDegrees);
    const yLegPlusCircle = this.circleRadius * this.getSinFromDegrees(triangleDegrees);

    //debugger;

    const xLegTemp = this.getCosFromDegrees(triangleDegrees);
    const yLegTemp = this.getSinFromDegrees(triangleDegrees);

    //should recieve quadrant number. just use same if/else as above
    const pushXAxis = Math.floor(xLegPlusCircle + this.circleRadius - accountForPieceX); //DO AS A PERCENTAGE OF X,Y UGH
    const pushYAxis = Math.floor(yLegPlusCircle + this.circleRadius - accountForPieceY);  //NOTE these should not be radius, but should take into account box heights ...
    
    
    if (piece <= 2) {
      this.right = pushXAxis.toString() + 'px';
      this.bottom = pushYAxis.toString() + 'px';
    }
    else if (piece > 2 && piece <= 4) {
      this.left = pushXAxis.toString() + 'px';
      this.bottom = pushYAxis.toString() + 'px';
    }
    else if (piece > 4 && piece <= 7) {
      this.left = pushXAxis.toString() + 'px';
      this.top = pushYAxis.toString() + 'px';
    }
    else { //pieces 8, 9
      this.right = pushXAxis.toString() + 'px';
      this.top = pushYAxis.toString() + 'px';
    }

    //debugger;
    //then use CircleHeight (service?, second input?) to set bottom/top & left/right values
  }

  //Math.cos works in radians by default
  getCosFromDegrees(degrees) {
    return Math.cos(degrees * Math.PI / 180);
  }
  getSinFromDegrees(degrees) {
    return Math.sin(degrees * Math.PI / 180);
  }



  generateRotateDegrees(piece: number) {
    //start w/ 0deg for 90/piece #2
    let rotationDegrees = 0;

    //backwards swithch statement w/ no breaks
    switch(piece) {
      case 1:
        rotationDegrees += 36;
      case 0: 
        rotationDegrees += 36;
      case 9: 
        rotationDegrees += 36;
      case 8: 
        rotationDegrees += 36;
      case 7: 
        rotationDegrees += 36;
      case 6: 
        rotationDegrees += 36;
      case 5: 
        rotationDegrees += 36;
      case 4: 
        rotationDegrees += 36;
      case 3: 
        rotationDegrees += 36;
      case 2: 
        break;
    }

    this.rotate = `rotate(${rotationDegrees}deg)`;  //or .5turn syntax
  }
}




  //might need to be [ngStyle]
  //OR percentages  
  //BC problem of circle radius/width 
  //inputs to directive or ... do it all in the component with renderer2 & local elements

  //separate directives for the diff layers? 
  //or include more logic in this single directive?
  // ^ in which case, no need to split input, just use index
  