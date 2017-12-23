import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-queue-view',
  templateUrl: './queue-view.component.html',
  styleUrls: ['./queue-view.component.scss']
})
export class QueueViewComponent implements OnInit, OnDestroy {
  @Input() queue : any;
  @Output() onHideRequested : EventEmitter<any> = new EventEmitter<any>();
  editingGroup : any = null;
  isEditing : any = false;
  groups : Array<any> = [];
  completedOffset : number;
  subscription : Subscription;
  peopleMapping : {[k: string]: string} = {
    '=0': 'zero people', '=1': 'one person', 'other': '# people'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.subscription = this.realtimeService.getGroupsByQueue(this.queue.id).subscribe(groups => {
      this.groups = _.chain(groups).filter(group => !group.completed).sortBy(group => group.position).value();
      this.completedOffset = groups.length - this.groups.length;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hideQueueView() {
    this.onHideRequested.emit();
  }

  addGroup() {
    this.editingGroup = null;
    this.isEditing = true;
  }

  startEdit(index : number) {
    this.editingGroup = this.groups[index].group;
    this.isEditing = true;
  }

  finishEdit() {
    this.isEditing = false;
  }

  markCompleted(index : number) {
    let group = this.groups[index].group;
    this.realtimeService.nextGroupQueue(group).toPromise();
  }

  finishReorder(newIndex : number, queueGroup : any) {
    newIndex += this.completedOffset;
    this.realtimeService.reorderGroup(newIndex, this.queue.id, queueGroup.id).toPromise();
  }

  advanceQueue() {
    this.realtimeService.advanceQueue(this.queue.id).toPromise();
  }

  reverseQueue() {
    this.realtimeService.reverseQueue(this.queue.id).toPromise();
  }

  nextGroup() {
    this.realtimeService.nextGroup(this.queue.id).toPromise();
  }
  
  setStatus(status : string) {
    this.realtimeService.updateQueue({
      id: this.queue.id,
      status: status,
    }).toPromise();
  }
}
