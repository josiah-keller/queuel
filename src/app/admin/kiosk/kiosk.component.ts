import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable,  Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent implements OnInit, OnDestroy {
  private queues : Array<any>;
  private shownQueues : Observable<any>;
  private shownQueueIds : Array<string> = [];
  private subscription : Subscription;
  
  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.subscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showQueue(id : string) {
    this.shownQueueIds.push(id);
    this.shownQueueIds = _.uniq(this.shownQueueIds);
  }

  hideQueue(id : string) {
    _.pull(this.shownQueueIds, id);
  }

  getQueueById(id : string) {
    return _.find(this.queues, queue => queue.id == id);
  }
}
