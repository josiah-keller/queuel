import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-queue-batches',
  templateUrl: './queue-batches.component.html',
  styleUrls: ['./queue-batches.component.scss']
})
export class QueueBatchesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() queue : any;
  currentBatchGroups : Array<any> = [];
  nextBatchGroups : Array<any> = [];
  currentBatchGroupsSubscription : Subscription;
  nextBatchGroupSubscription : Subscription;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentBatchGroupsSubscription =
      this.realtimeService.getQueueGroupsForBatch(this.queue.currentBatch.id).subscribe(groups => {
        this.currentBatchGroups = groups;
      });
    this.nextBatchGroupSubscription =
      this.realtimeService.getQueueGroupsForBatch(this.queue.nextBatch.id).subscribe(groups => {
        this.nextBatchGroups = groups;
      });
  }
  
  ngOnDestroy() {
    this.currentBatchGroupsSubscription.unsubscribe();
    this.nextBatchGroupSubscription.unsubscribe();
  }

  removeFromBatch(batchGroups : Array<any>, index : number) {
    let queueGroup = batchGroups[index];
    this.realtimeService.removeQueueGroupFromBatch(queueGroup.batch, queueGroup.id).toPromise();
  }

  calculateBatchSize(queueGroups : Array<any>) {
    return queueGroups.reduce((total, queueGroup) => {
      return total + queueGroup.group.groupSize;
    }, 0);
  }
}
