import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss']
})
export class QueueStatusComponent implements OnInit {
  @Input() status : string;

  constructor() { }

  ngOnInit() {
  }

}
