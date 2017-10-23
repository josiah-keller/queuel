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
  private get isNew() : boolean { return !this.group; };
  private queues : Array<any> = null;
  private queuesBank : Array<any> = [];
  private selectedQueues : Array<any> = [];
  private subscription : Subscription;
  private noSelectedQueues : boolean = false;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.subscription = this.realtimeService.getQueues().subscribe(queues => {
      this.queues = queues;
      this.queuesBank = _.reject(this.queues, queue => _.includes(this.selectedQueues, queue));
    });
  }

  ngOnChanges() {
    if (this.queues) {
      this.queuesBank = _.clone(this.queues);
    }
    this.selectedQueues = [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  save() {
    if (this.selectedQueues.length === 0) {
      this.noSelectedQueues = true;
      return;
    }
  }

  cancel() {
    this.onFinish.emit(null);
  }
}
