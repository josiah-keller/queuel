import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-event-staff',
  templateUrl: './event-staff.component.html',
  styleUrls: ['./event-staff.component.scss']
})
export class EventStaffComponent implements OnInit, OnDestroy {
  queuesSubscription : Subscription;
  groupsSubscription : Subscription;
  queues : Array<any> = [];
  groups : Array<any> = [];
  selectedQueue : any = null;
  peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queuesSubscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
    });
  }

  ngOnDestroy() {
    this.queuesSubscription.unsubscribe();
    if (this.selectedQueue) {
      this.groupsSubscription.unsubscribe();
    }
  }

  selectQueue(queue : any) {
    this.selectedQueue = queue;
    this.groupsSubscription = this.realtimeService.getGroupsByQueue(queue.id).subscribe(groups => {
      this.groups = _.chain(groups)
        .reject(group => group.completed || group.pending)
        .sortBy(group => group.position)
        .value();
    });
  }

  setStatus(status : string) {
    this.selectedQueue.status = status;
    this.realtimeService.updateQueue({
      id: this.selectedQueue.id,
      status: status
    }).toPromise();
  }
}
