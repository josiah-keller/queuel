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
  private adding : Boolean = false;
  private newQueue : any;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queues = this.realtimeService.getQueues();
  }

  startAdd() {
    this.newQueue = {
      name: "new queue",
      status: "open",
    };
    this.adding = true;
  }

  finishAdd() {
    this.realtimeService.addQueue(this.newQueue).toPromise();
    this.adding = false;
  }

  cancelAdd() {
    this.adding = false;
  }
}
