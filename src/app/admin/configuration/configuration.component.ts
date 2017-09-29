import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  animations: [
    trigger("queueBlock", [
      transition("void => *", [
        style({
          transform: "scale(0.9)",
          opacity: 0
        }),
        animate("100ms ease-out")
      ]),
      transition("* => void", [
        animate("100ms ease-out", style({
          transform: "scale(0.9)",
          opacity: 0
        }))
      ])
    ]),
  ],
})
export class ConfigurationComponent implements OnInit {
  private queues : Observable<any>;
  private adding : Boolean = false;
  private newQueue : any;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.queues = this.realtimeService.getQueues();
  }

  startAdd() {
    this.newQueue = {
      name: "new queue",
      status: "open",
    };
    this.adding = true;
  }

  finishAdd() {
    this.realtimeService.addQueue(this.newQueue).toPromise();
    this.adding = false;
  }

  cancelAdd() {
    this.adding = false;
  }
}
