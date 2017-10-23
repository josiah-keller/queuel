import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-queue-view',
  templateUrl: './queue-view.component.html',
  styleUrls: ['./queue-view.component.scss']
})
export class QueueViewComponent implements OnInit, OnDestroy {
  @Input() queue : any;
  @Output() onHideRequested : EventEmitter<any> = new EventEmitter<any>();
  private editingGroup : any = null;
  private isEditing : any = false;
  private groups : Array<any>;
  private subscription : Subscription;
  private peopleMapping : {[k: string]: string} = {
    '=0': 'No people', '=1': 'One person', 'other': '# people'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.subscription = this.realtimeService.getGroupsByQueue(this.queue.id).subscribe(groups => {
      this.groups = groups;
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
}
