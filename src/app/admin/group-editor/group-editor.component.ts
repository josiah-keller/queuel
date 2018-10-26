import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() group : any;
  @Output() onFinish : EventEmitter<any> = new EventEmitter<any>();
  get isNew() : boolean { return !this.group; };
  queues : Array<any> = null;
  queuesBank : Array<any> = [];
  selectedQueues : Array<any> = [];
  queuesSubscription : Subscription;
  noSelectedQueues : boolean = false;
  newGroup : any = {};
  movableQueueGroups : Array<any> = [];

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queuesSubscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
      this.queuesBank = _.reject(this.queues, queue => _.includes(this.selectedQueues, queue));
    });
  }

  ngOnChanges() {
    if (this.queues) {
      this.queuesBank = _.clone(this.queues);
    }
    this.selectedQueues = [];
    this.newGroup = this.group ? _.clone(this.group) : {};

    if (this.group) {
      this.realtimeService.getMovableQueueGroups(this.group).subscribe(movableQueueGroups => {
        this.movableQueueGroups = movableQueueGroups;
      });
    }
  }

  ngOnDestroy() {
    this.queuesSubscription.unsubscribe();
  }

  save() {
    if (this.isNew) {
      if (this.selectedQueues.length === 0) {
        this.noSelectedQueues = true;
        return;
      }
      this.newGroup.queueOrder = _.map(this.selectedQueues, "id");
      this.realtimeService.addGroup(this.newGroup).toPromise();
    } else {
      this.realtimeService.updateGroup(this.newGroup).toPromise();
    }
    this.onFinish.emit(null);
  }

  removeQueueGroup(queueGroup : any) {
    this.realtimeService.removeQueueGroup(queueGroup).subscribe(destroyedQueueGroup => {
      _.pull(this.movableQueueGroups, queueGroup);
    });
  }

  delete() {
    this.realtimeService.deleteGroup(this.group.id).toPromise();
    this.onFinish.emit(null);
  }

  cancel() {
    this.onFinish.emit(null);
  }
}
