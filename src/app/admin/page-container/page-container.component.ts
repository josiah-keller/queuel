import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent implements OnInit, OnDestroy {
  disconnected : boolean = false;
  connectionStatusSubscription : Subscription;

  constructor(private realtimeService : RealtimeService) { }

  ngOnInit() {
    this.connectionStatusSubscription = this.realtimeService.connectionStatus.subscribe(status => {
      this.disconnected = status === "disconnected";
    });
  }

  ngOnDestroy() {
    this.connectionStatusSubscription.unsubscribe();
  }
  
  reconnect() {
    // For now, just reload the page
    window.location.reload();
  }
}
