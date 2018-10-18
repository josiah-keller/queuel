import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-event-staff',
  templateUrl: './event-staff.component.html',
  styleUrls: ['./event-staff.component.scss']
})
export class EventStaffComponent implements OnInit, OnDestroy {
  queuesSubscription : Subscription;
  currentBatchGroupsSubscription : Subscription;
  nextBatchGroupSubscription : Subscription;
  queues : Array<any> = [];
  currentBatchGroups : Array<any> = [];
  nextBatchGroups : Array<any> = [];
  selectedQueueIndex : number = null;
  peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queuesSubscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
      if (this.selectedQueueIndex !== null) this.selectQueue(this.selectedQueueIndex);
    });
  }

  ngOnDestroy() {
    this.queuesSubscription.unsubscribe();
    if (this.currentBatchGroupsSubscription) {
      this.currentBatchGroupsSubscription.unsubscribe();
    }
    if (this.nextBatchGroupSubscription) { 
      this.nextBatchGroupSubscription.unsubscribe();
    }
  }

  selectQueue(index : number) {
    this.selectedQueueIndex = index;
    let queue = this.queues[index];
    if (this.currentBatchGroupsSubscription) {
      this.currentBatchGroupsSubscription.unsubscribe();
    }
    if (this.nextBatchGroupSubscription) { 
      this.nextBatchGroupSubscription.unsubscribe();
    }
    this.currentBatchGroupsSubscription = this.realtimeService.getQueueGroupsForBatch(queue.currentBatch.id)
      .subscribe(groups => {
        this.currentBatchGroups = groups;
      });
    this.nextBatchGroupSubscription = this.realtimeService.getQueueGroupsForBatch(queue.nextBatch.id)
      .subscribe(groups => {
        this.nextBatchGroups = groups;
      });
  }

  setStatus(status : string) {
    this.queues[this.selectedQueueIndex].status = status;
    this.realtimeService.updateQueue({
      id: this.queues[this.selectedQueueIndex].id,
      status: status
    }).toPromise();
  }

  calculateBatchSize(queueGroups : Array<any>) {
    return queueGroups.reduce((total, queueGroup) => {
      return total + queueGroup.group.groupSize;
    }, 0);
  }
}
