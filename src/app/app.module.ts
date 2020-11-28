import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PositionDirective } from './position.directive';
import { CircleRepresentationComponent } from './circle-representation/circle-representation.component';
import { LineRepresentationComponent } from './line-representation/line-representation.component';
import { PositionLeftStartDirective } from './position-left-start.directive';

@NgModule({
  declarations: [
    AppComponent,
    PositionDirective,
    CircleRepresentationComponent,
    LineRepresentationComponent,
    PositionLeftStartDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
