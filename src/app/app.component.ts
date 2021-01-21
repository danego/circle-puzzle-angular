import { Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { PieceSizingService } from './piece-sizing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'puzzle-circle-angular';

  displayControls: boolean = false;
  currentLayout: string;
  currentLayoutSub: Subscription;

  @ViewChild('rSpecial') leftone: ElementRef;

  constructor(private renderer: Renderer2, private pieceSizingService: PieceSizingService) {}

  ngOnInit() { 
    this.currentLayoutSub = this.pieceSizingService.currentLayout.subscribe(currentLayout => {
      this.currentLayout = currentLayout;
    });
  }

  ngOnDestroy() {
    if (this.currentLayoutSub) this.currentLayoutSub.unsubscribe();
  }
}
