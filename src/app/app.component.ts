import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { PieceSizingService } from './piece-sizing.service';
import { SolutionsGrabberService } from './solutions-grabber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'puzzle-circle-angular';

  currentLayout: string;
  currentPattern: string = 'planets';

  currentLayoutSub: Subscription;
  currentPatternSub: Subscription;

  @ViewChild('rSpecial') leftone: ElementRef;

  constructor(private pieceSizingService: PieceSizingService, private solutionsGrabberService: SolutionsGrabberService) {}

  ngOnInit() { 
    this.currentLayoutSub = this.pieceSizingService.currentLayout.subscribe(currentLayout => {
      this.currentLayout = currentLayout;
    });

    this.currentPatternSub = this.solutionsGrabberService.currentPatternSubject.subscribe(patternName => {
      this.currentPattern = patternName;
    });
  }

  generateHeightBasedOnLayout() {
    let heightValue;
    // for starting and sizing
    if (!this.currentLayout) {
      heightValue = 'calc(100vh - 15px)';
    }
    // after circleSize and layout generated
    else {
      heightValue = 'auto';
    }
    return heightValue;
  }

  ngOnDestroy() {
    if (this.currentLayoutSub) this.currentLayoutSub.unsubscribe();
  }
}
