import { Directive, Input, HostBinding, OnInit } from '@angular/core';

@Directive({
  selector: '[positionBottomStart]'
})

export class PositionBottomStartDirective implements OnInit {
  circleRadius: number;

  //selector tag is also used to input piece number
  @Input('positionBottomStart') pieceNumber: string;
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

    this.convertToAngleCssCartesian(
      this.convertToAngleDegrees(piece), 
      piece
    );
    this.generateRotateDegrees(piece);
  }

  convertToAngleDegrees(piece: number) {
    //piece 0 starts at 54deg. Each next piece is 72deg away
    const degrees = (piece * 72) + 54;

    //triangle degrees is the angle between hypotenuse and X-axis
    //correspond piece number to quadrant to correctly calculate triangle degrees
    let triangleDegrees;
    if (piece === 0) {
      triangleDegrees = degrees;
    }
    else if (piece === 1) {
      triangleDegrees = 180 - degrees;
    }
    else if (piece === 2) {
      triangleDegrees = degrees - 180;
    }
    else {
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
    if (piece === 0) {
      this.right = pushXAxis.toString() + 'px';
      this.bottom = pushYAxis.toString() + 'px';
    }
    else if (piece === 1) {
      this.left = pushXAxis.toString() + 'px';
      this.bottom = pushYAxis.toString() + 'px';
    }
    else if (piece === 2) {
      this.left = pushXAxis.toString() + 'px';
      this.top = pushYAxis.toString() + 'px';
    }
    else {
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
    //piece (0) with largest degree value runs through all cases
    let rotationDegrees = 0;

    switch(piece) {
      case 0: 
        rotationDegrees += 72;
      case 4: 
        rotationDegrees += 72;
      case 3: 
        rotationDegrees += 72;
      case 2: 
        rotationDegrees += 72;
      case 1: 
        rotationDegrees += 36;
    }

    this.rotate = `rotate(${rotationDegrees}deg)`;
  }
}
