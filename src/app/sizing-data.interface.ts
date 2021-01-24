import { PieceSizesInterface } from "./piece-sizes.interface";

export interface SizingDataInterface {
  pieceZero: PieceSizesInterface;
  pieceOne: PieceSizesInterface;
  pieceTwo: PieceSizesInterface;
  pieceThree: PieceSizesInterface;
  fontSizeFactor: number;
  fontSizeForPieces?: number;
  containerSize: number;
  minBankWidth: number;
}