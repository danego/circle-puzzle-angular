import { Directive, HostBinding, Input, OnInit } from "@angular/core";

@Directive({
  selector: '[positionTopStart]'
})

export class PositionTopStartDirective implements OnInit {
  circleRadius: number;

  //selector tag is also used to input piece number
  @Input('positionTopStart') pieceNumber: string;
  @Input('circleHeight') circleHeight: string;
  @Input('pieceWidth') pieceWidth: string;
  @Input('pieceHeight') pieceHeight: string;

  @HostBinding('style.top') top: string;
  @HostBinding('style.bottom') bottom: string;
  @HostBinding('style.left') left: string;
  @HostBinding('style.right') right: string;
  @HostBinding('style.transform') rotate: string;

  constructor() {}

  ngOnInit() {
    const piece = +this.pieceNumber;
    this.circleRadius = +this.circleHeight / 2;
    
    this.convertToAngleCssCartesian(this.convertToAngleDegrees(piece), piece);
    this.generateRotateDegrees(piece);
  }

  convertToAngleDegrees(piece: number) {
    //piece 0 starts at 18deg. Each next piece is 36deg away
    const degrees = ((piece + 1) * 36) - 18;

    //triangle degrees is the angle between hypotenuse and X-axis
    //correspond piece number to quadrant to correctly calculate triangle degrees
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

  //takes the degree of triangle to X axis and the piece # to determine quadrant
  convertToAngleCssCartesian(triangleDegrees: number, piece: number) {  
    //halve inputted dimensions for puzzle piece  
    const accountForPieceX = +this.pieceWidth / 2;
    const accountForPieceY = +this.pieceHeight / 2;
  
    //we must push from opposite direction and thus must add in radius
    const xLegPlusCircle = this.circleRadius * this.getCosFromDegrees(triangleDegrees);
    const yLegPlusCircle = this.circleRadius * this.getSinFromDegrees(triangleDegrees);

    const pushXAxis = Math.floor(xLegPlusCircle + this.circleRadius - accountForPieceX);
    const pushYAxis = Math.floor(yLegPlusCircle + this.circleRadius - accountForPieceY);
    
    //correspond piece number to quadrant to correctly apply positioning
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
  }

  //Math.cos works in radians by default
  getCosFromDegrees(degrees) {
    return Math.cos(degrees * Math.PI / 180);
  }
  getSinFromDegrees(degrees) {
    return Math.sin(degrees * Math.PI / 180);
  }

  generateRotateDegrees(piece: number) {
    //backwards switch statement w/ no breaks
    //piece (1) with largest degree value runs through all cases
    let rotationDegrees = 0;

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
  