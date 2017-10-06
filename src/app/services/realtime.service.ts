import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as SocketIoClient from 'socket.io-client';
import * as SailsIoClient from 'sails.io.js';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';

@Injectable()
export class RealtimeService {
  private io;
  private apiUrl : string;

  private queuesObservable : Observable<any>;
  private hasAttachedQueuesEvent : Boolean = false;
  private queues : Array<any>;

  private updateCollection(collection : Array<any>, event : any) {
    if (event.verb === "created") {
      collection.push(event.data);
    }
    if (event.verb === "destroyed") {
      _.remove(collection, item => item.id == event.id);
    }
    if (event.verb === "updated") {
      let index = _.findIndex(collection, item => item.id == event.id);
      collection[index] = event.data;
    }
    if (event.verb === "addedTo") {
      let index = _.findIndex(collection, item => item.id == event.id);
      if (event.added) collection[index][event.attribute].push(event.added);
    }
    if (event.verb === "removedFrom") {
      let index = _.findIndex(collection, item => item.id == event.id);
      _.remove(collection[index][event.attribute], item => item.id == event.removedId);
    }
  }

  constructor(private ngZone : NgZone) {
    this.apiUrl = environment.apiUrl;
    this.io = SailsIoClient(SocketIoClient);
    this.io.sails.url = this.apiUrl;
  }

  getQueues() : Observable<any> {
    if (this.queuesObservable) return this.queuesObservable;
    this.queuesObservable = new Observable(observer => {
      if (! this.hasAttachedQueuesEvent) {
        this.io.socket.on("queue", event => {
          console.log("EVENT", event);
          this.ngZone.run(() => {
            this.updateCollection(this.queues, event);
            observer.next(this.queues);
          });
        });
        this.hasAttachedQueuesEvent = true;
      }
      this.io.socket.get("/queue", (queues, jwr) => {
        this.ngZone.run(() => {
          this.queues = _.clone(queues);
          observer.next(this.queues);
        });
      });
    });
    return this.queuesObservable;
  }

  addQueue(queue : any) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post("/queue", queue, (queue, jwr) => {
        this.ngZone.run(() => {
          observer.next(queue);
        });
      });
    });
  }

  deleteQueue(id : string) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.delete("/queue/" + id, (queues, jwr) => {
        this.ngZone.run(() => {
          observer.next(queues);
        });
      });
    });
  }
}
