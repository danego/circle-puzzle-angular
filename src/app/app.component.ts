import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'puzzle-circle-angular';

  @ViewChild('rSpecial') leftone: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() { }
}
