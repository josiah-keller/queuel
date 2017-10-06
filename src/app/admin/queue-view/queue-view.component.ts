import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-queue-view',
  templateUrl: './queue-view.component.html',
  styleUrls: ['./queue-view.component.scss']
})
export class QueueViewComponent implements OnInit {
  @Input() queue : any;

  constructor() { }

  ngOnInit() {
  }

}
