import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {
  private queuesSubscription : Subscription;
  private groupsSubscriptions : any = {};
  private queues : Array<any> = [];
  private groups : Array<any> = [];

  private hiddenQueues : Array<any> = [];
  private shownQueues : Array<any> = [];

  private displayPropertiesShown : Boolean = false;

  private peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };
  private groupMapping : {[k: string]: string} = {
    '=0': '0 groups', '=1': 'one group', 'other': '# groups'
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
