import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CircleRepresentationComponent } from './circle-representation/circle-representation.component';
import { LineRepresentationComponent } from './line-representation/line-representation.component';
import { PositionTopStartDirective } from './position-top-start.directive';
import { PositionLeftStartDirective } from './position-left-start.directive';
import { PositionBottomStartDirective } from './position-bottom-start.directive';
import { StopPropoDirective } from './stop-propo.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RotatePieceDirective } from './rotate-piece.directive';
import { PieceBankComponent } from './piece-bank/piece-bank.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CalculateHeightDirective } from './calculate-height.directive';

import { IsScrollingDirective } from './is-scrolling.directive';


@NgModule({
  declarations: [
    AppComponent,
    CircleRepresentationComponent,
    LineRepresentationComponent,
    PositionTopStartDirective,
    PositionLeftStartDirective,
    PositionBottomStartDirective,
    StopPropoDirective,
    RotatePieceDirective,
    PieceBankComponent,
    ControlPanelComponent,
    CalculateHeightDirective,
    IsScrollingDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
