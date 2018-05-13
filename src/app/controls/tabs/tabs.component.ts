import { Component, OnInit } from '@angular/core';
import { TabPageComponent } from '../tabpage/tabpage.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  tabs : TabPageComponent[] = [];
  activeTabIndex : number = 0;

  constructor() { }

  ngOnInit() {
    this.setActiveTab(0);
  }

  addTab(tab : TabPageComponent) {
    this.tabs.push(tab);
  }

  setActiveTab(index : number) {
    this.tabs[this.activeTabIndex].active = false;
    this.activeTabIndex = index;
    this.tabs[index].active = true;
  }
}
