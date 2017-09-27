import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private queues : Observable<any>;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queues = this.realtimeService.getQueues();
  }
}
