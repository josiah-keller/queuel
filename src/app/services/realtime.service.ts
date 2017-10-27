import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
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
  private queueObservers : Array<Observer<any>> = [];

  private groupsObservables : Object = {};
  private hasAttachedGroupsEvent : Object = {};
  private groups : Object = {};
  private groupObservers : Object = {};

  private updateCollection(collection : Array<any>, event : any) {
    if (event.verb === "created") {
      collection.push(event.data);
    }
    if (event.verb === "destroyed") {
      _.remove(collection, item => item.id == event.id);
    }
    if (event.verb === "updated") {
      let index = _.findIndex(collection, item => item.id == event.id);
      _.assign(collection[index], event.data);
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

  private updateObservers(observers : Array<Observer<any>>, value : Array<any>) {
    observers.forEach(observer => observer.next(value));
  }

  constructor(private ngZone : NgZone) {
    this.apiUrl = environment.apiUrl;
    this.io = SailsIoClient(SocketIoClient);
    this.io.sails.url = this.apiUrl;
  }

  getQueues() : Observable<any> {
    if (this.queuesObservable) return this.queuesObservable;
    this.queuesObservable = new Observable(observer => {
      this.queueObservers.push(observer);
      if (! this.hasAttachedQueuesEvent) {
        this.io.socket.on("queue", event => {
          this.ngZone.run(() => {
            this.updateCollection(this.queues, event);
            this.updateObservers(this.queueObservers, this.queues);
          });
        });
        this.hasAttachedQueuesEvent = true;
      }
      this.io.socket.get("/queue", (queues, jwr) => {
        this.ngZone.run(() => {
          this.queues = _.clone(queues);
          this.updateObservers(this.queueObservers, this.queues);
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

  getGroupsByQueue(queueId : string) : Observable<any> {
    if (this.groupsObservables[queueId]) return this.groupsObservables[queueId];
    this.groupsObservables[queueId] = new Observable(observer => {
      if (! this.groupObservers[queueId]) this.groupObservers[queueId] = [];
      if (! this.groups[queueId]) this.groups[queueId] = [];

      this.groupObservers[queueId].push(observer);
      if (! this.hasAttachedGroupsEvent[queueId]) {
        this.io.socket.on("queuegroup", event => {
          if (event.data && event.data.queue != queueId) return; // Ignore other queues
          this.ngZone.run(() => {
            this.updateCollection(this.groups[queueId], event);
            this.updateObservers(this.groupObservers[queueId], this.groups[queueId]);
          });
        });
        this.io.socket.on("group", event => {
          // Only interested in update events; others covered by queueGroup events
          if (event.verb === "updated") {
            this.ngZone.run(() => {
              this.updateCollection(_.map(this.groups[queueId], "group"), event);
              this.updateObservers(this.groupObservers[queueId], this.groups[queueId]);
            });
          }
        })
        this.hasAttachedGroupsEvent[queueId] = true;
      }
      this.io.socket.get(`/queue/${queueId}/group`, (groups, jwr) => {
        this.ngZone.run(() => {
          this.groups[queueId] = _.clone(groups);
          this.updateObservers(this.groupObservers[queueId], this.groups[queueId]);
        });
      });
    });
    return this.groupsObservables[queueId];
  }

  addGroup(group : any) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post("/group", group, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }

  deleteGroup(id : string) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.delete("/group/" + id, (groups, jwr) => {
        this.ngZone.run(() => {
          observer.next(groups);
        });
      });
    });
  }

  updateGroup(group : any) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post(`/group/${group.id}`, group, (groups, jwr) => {
        this.ngZone.run(() => {
          observer.next(groups);
        });
      });
    });
  }

  reorderGroup(index : number, queueId : string, queueGroupId : string) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post(`/queue/${queueId}/reorder`, {
        queueGroupId,
        index,
      }, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }

  advanceQueue(queueId : string) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post(`/queue/${queueId}/advance`, {
        queueId,
      }, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }

  reverseQueue(queueId : string) : Observable<any> {
    return new Observable(observer => {
      this.io.socket.post(`/queue/${queueId}/reverse`, {
        queueId,
      }, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }
}
