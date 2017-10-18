import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent implements OnInit, OnChanges {
  @Input() group : any;
  private get isNew() : boolean { return !this.group; };
  private queues : Array<any> = null;
  private queuesBank : Array<any> = [];
  private selectedQueues : Array<any> = [];

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.realtimeService.getQueues().subscribe(queues => {
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

  dropQueue(event : any) {
    _.remove(this.queuesBank, event.dragData);
    this.selectedQueues.push(event.dragData);
  }
}
