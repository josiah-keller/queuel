import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  animations: [
    trigger("group", [
      transition("void => *", [
        style({
          opacity: 0,
        }),
        animate("500ms ease-out")
      ]),
      transition("* => void", [
        animate("250ms ease-out", style({
          transform: "translateY(-50%)",
          opacity: 0,
        }))
      ])
    ]),
    trigger("alert", [
      state("waiting", style({
        opacity: 0
      })),
      transition("* => in", [
        animate("250ms ease-in-out", keyframes([
          style({
            opacity: 0,
            transform: "scale(0.8)",
            offset: 0,
          }),
          style({
            opacity: 1,
            transform: "scale(1.2)",
            offset: 0.8,
          }),
          style({
            transform: "scale(1.0)",
            offset: 1.0
          }),
        ])),
      ]),
    ]),
  ],
})
export class DisplayComponent implements OnInit, OnDestroy {
  queuesSubscription : Subscription;
  groupsSubscriptions : any = {};
  batchSubscriptions : any = {};
  queues : Array<any> = [];
  groups : any = {};
  batchGroups : any = {};

  alertsSubscription : Subscription;
  alertsBuffer : Array<any> = [];

  hiddenQueues : Array<any> = [];
  shownQueues : Array<any> = [];

  displayPropertiesShown : Boolean = false;

  peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };
  groupMapping : {[k: string]: string} = {
    '=0': '0 groups', '=1': 'One group', 'other': '# groups'
  };
  theseMapping : {[k: string]: string} = {
    '=0': 'No group', '=1': 'This group', 'other': 'These groups'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queuesSubscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
      this.hiddenQueues = _.difference(this.queues,  this.shownQueues);
      this.updateBatchSubscriptions();
    });
    this.alertsSubscription = this.realtimeService.subscribeAlerts().subscribe(newAlert => {
      this.bufferAlert(newAlert);
    });
  }

  ngOnDestroy() {
    this.queuesSubscription.unsubscribe();
    _.forOwn(this.groupsSubscriptions, (subscription : Subscription) => {
      subscription.unsubscribe();
    });
    _.forOwn(this.batchSubscriptions, (subscription : Subscription) => {
      subscription.unsubscribe();
    })
  }

  showQueue(queue : any) {
    _.pull(this.hiddenQueues, queue);
    this.shownQueues.push(queue);
    this.groupsSubscriptions[queue.id] = this.realtimeService.getGroupsByQueue(queue.id)
      .subscribe(groups => {
        this.updateGroups(groups, queue.id);
      });
    this.groups[queue.id] = [];
    this.subscribeToBatch(queue);
  }

  subscribeToBatch(queue : any) {
    this.batchSubscriptions[queue.id] = this.realtimeService.getQueueGroupsForBatch(queue.nextBatch.id)
      .subscribe(queueGroups => {
        this.batchGroups[queue.id] = queueGroups;
      });
    this.batchGroups[queue.id] = [];
  }

  updateBatchSubscriptions() {
    _.forEach(this.queues, queue => {
      if (this.batchSubscriptions.hasOwnProperty(queue.id)) {
        this.batchSubscriptions[queue.id].unsubscribe();
        this.subscribeToBatch(queue);
      }
    });
  }

  hideQueue(queue : any) {
    _.pull(this.shownQueues, queue);
    this.groupsSubscriptions[queue.id].unsubscribe();
    this.batchSubscriptions[queue.id].unsubscribe();
    this.hiddenQueues.push(queue);
  }

  toggle() {
    this.displayPropertiesShown = ! this.displayPropertiesShown;
  }

  updateGroups(groups : Array<any>, queueId : string) {
    this.groups[queueId] = _.chain(groups)
      .reject(group => group.completed || group.pending || group.batch)
      .sortBy(group => group.position)
      .value();
  }

  bufferAlert(newAlert : any) {
    if (this.alertsBuffer.length === 0) {
      this.nextAlert();
    }
    this.alertsBuffer.push(newAlert);
  }

  nextAlert() {
    setTimeout(() => {
      this.alertsBuffer.shift();
      if (this.alertsBuffer.length > 0) {
        this.nextAlert();
      }
    }, 5000);
  }
}
