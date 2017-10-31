import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
          opacity: 0
        }),
        animate("500ms ease-out")
      ]),
      transition("* => void", [
        animate("250ms ease-out", style({
          transform: "translateY(-50%)",
          opacity: 0
        }))
      ])
    ]),
  ],
})
export class DisplayComponent implements OnInit, OnDestroy {
  queuesSubscription : Subscription;
  groupsSubscriptions : any = {};
  queues : Array<any> = [];
  groups : Array<any> = [];

  hiddenQueues : Array<any> = [];
  shownQueues : Array<any> = [];

  displayPropertiesShown : Boolean = false;

  peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };
  groupMapping : {[k: string]: string} = {
    '=0': '0 groups', '=1': 'One group', 'other': '# groups'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queuesSubscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
      this.hiddenQueues = _.difference(this.queues,  this.shownQueues);
    });
  }

  ngOnDestroy() {
    this.queuesSubscription.unsubscribe();
  }

  showQueue(queue : any) {
    _.pull(this.hiddenQueues, queue);
    this.shownQueues.push(queue);
    this.groupsSubscriptions[queue.id] = this.realtimeService.getGroupsByQueue(queue.id)
      .subscribe(groups => {
        this.updateGroups(groups, queue.id);
      });
    this.groups[queue.id] = [];
  }

  hideQueue(queue : any) {
    _.pull(this.shownQueues, queue);
    this.hiddenQueues.push(queue);
  }

  toggle() {
    this.displayPropertiesShown = ! this.displayPropertiesShown;
  }

  updateGroups(groups : Array<any>, queueId : string) {
    this.groups[queueId] = _.chain(groups)
      .reject(group => group.completed || group.pending)
      .sortBy(group => group.position)
      .value();
  }
}
