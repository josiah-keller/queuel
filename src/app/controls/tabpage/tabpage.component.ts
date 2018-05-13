import { Component, OnInit, Input } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-tabpage',
  templateUrl: './tabpage.component.html',
  styleUrls: ['./tabpage.component.scss']
})
export class TabPageComponent implements OnInit {
  @Input() tabTitle : string;
  active : boolean;

  constructor(tabsHost : TabsComponent) {
    tabsHost.addTab(this);
  }

  ngOnInit() {
  }
}
