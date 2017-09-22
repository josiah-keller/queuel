import { Component, OnInit } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.realtimeService.getQueues().subscribe(() => {})
  }

}
