import { Component, OnInit } from '@angular/core';

import { BankCircleConnectorService } from '../bank-circle-connector.service';

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  constructor(private bankCircleConnectorService: BankCircleConnectorService) { }

  ngOnInit() {
    
  }

  moveAllToBank() {
    this.bankCircleConnectorService.transferAllToBank();

  }
  moveAllToCircle() {
    this.bankCircleConnectorService.transferAllToCircle();
  }

}
