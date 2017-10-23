import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-queue-view',
  templateUrl: './queue-view.component.html',
  styleUrls: ['./queue-view.component.scss']
})
export class QueueViewComponent implements OnInit {
  @Input() queue : any;
  @Output() onHideRequested : EventEmitter<any> = new EventEmitter<any>();
  private editingGroup : any = null;
  private isEditing : any = false;
  private groups : Observable<any>;
  private peopleMapping : {[k: string]: string} = {
    '=0': 'No people', '=1': 'One person', 'other': '# people'
  };

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.groups = this.realtimeService.getGroupsByQueue(this.queue.id);
  }

  hideQueueView() {
    this.onHideRequested.emit();
  }

  addGroup() {
    this.isEditing = true;
  }

  finishEdit() {
    this.isEditing = false;
  }
}
