import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private menuOpen : Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.menuOpen = ! this.menuOpen;
  }
}
