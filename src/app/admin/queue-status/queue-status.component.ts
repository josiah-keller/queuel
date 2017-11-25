import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss']
})
export class QueueStatusComponent implements OnInit {
  @Input() status : string;
  @Output() onStatusChange : EventEmitter<string> = new EventEmitter<string>();
  
  private statuses : Array<string> = ["open", "inProgress", "blocked"];
  private statusIndex : number;

  selecting : boolean = false;

  constructor() { }

  ngOnInit() {
    this.statusIndex = this.statuses.indexOf(this.status);
  }

  nextStatus() {
    this.status = this.statuses[++this.statusIndex % this.statuses.length];
    this.onStatusChange.emit(this.status);
  }
}
