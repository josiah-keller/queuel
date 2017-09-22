import { Injectable } from '@angular/core';
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
  private queues : Array<any>;

  private updateCollection(collection : Array<any>, event : any) {
    if (event.verb === "created") {
      collection.push(event.data);
    }
    if (event.verb === "destroyed") {
      _.remove(collection, item => item.id === event.id);
    }
    if (event.verb === "updated") {
      let index = _.findIndex(collection, item => item.id === event.id);
      collection[index] = event.data;
    }
    if (event.verb === "addedTo") {
      let index = _.findIndex(collection, item => item.id === event.id);
      if (event.added) collection[index][event.attribute].push(event.added);
    }
    if (event.verb === "removedFrom") {
      let index = _.findIndex(collection, item => item.id === event.id);
      _.remove(collection[index][event.attribute], item => item.id === event.removedId);
    }
  }

  constructor() {
    this.apiUrl = environment.apiUrl;
    this.io = SailsIoClient(SocketIoClient);
    this.io.sails.url = this.apiUrl;
  }

  getQueues() : Observable<any> {
    if (this.queuesObservable) return this.queuesObservable;
    this.queuesObservable = new Observable(observer => {
      this.io.socket.on("queue", event => {
        this.updateCollection(this.queues, event);
        observer.next(this.queues);
      });
      this.io.socket.get("/queue", (queues, jwr) => {
        this.queues = _.clone(queues);
        observer.next(this.queues);
      });
    });
    return this.queuesObservable;
  }
}
