import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { CircleRepresentationComponent } from './circle-representation/circle-representation.component';
import { PositionTopStartDirective } from './position-top-start.directive';
import { PositionLeftStartDirective } from './position-left-start.directive';
import { PositionBottomStartDirective } from './position-bottom-start.directive';
import { StopPropoDirective } from './stop-propo.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PieceBankComponent } from './piece-bank/piece-bank.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ControlPanelVerticalComponent } from './control-panel-vertical/control-panel-vertical.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { CalculateHeightDirective } from './calculate-height.directive';


@NgModule({
  declarations: [
    AppComponent,
    CircleRepresentationComponent,
    PositionTopStartDirective,
    PositionLeftStartDirective,
    PositionBottomStartDirective,
    StopPropoDirective,
    PieceBankComponent,
    ControlPanelComponent,
    ControlPanelVerticalComponent,
    CalculateHeightDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
