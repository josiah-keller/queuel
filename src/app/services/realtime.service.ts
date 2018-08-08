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

  private batchesObservables : Object = {};
  private hasAttachedBatchesEvent : Object = {};
  private batches : Object = {};
  private batchObservers : Object = {};

  private batchQueueGroupsObservables : Object =  {};
  private hasAttachedBatchQueueGroupsEvent : Object = {};
  private batchQueueGroups : Object = {};
  private batchQueueGroupsObservers : Object = {};

  private authenticated : boolean = false;

  private updateCollection(collection : Array<any>, event : any) {
    if (event.verb === "created") {
      collection.push(event.data);
    }
    if (event.verb === "destroyed") {
      _.remove(collection, item => item.id == event.id);
    }
    if (event.verb === "updated") {
      let index = _.findIndex(collection, item => item.id == event.id);
      let newData = _.cloneDeep(collection[index]);
      _.assign(newData, event.data);
      collection[index] = newData;
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

  private doGet(path : string, callback : Function) {
    this.io.socket.get(path, (body, jwr) => {
      if (jwr.statusCode === 403) {
        this.authenticated = false;
      }
      callback(body, jwr);
    });
  }

  private doPost(path : string, data : any, callback : Function) {
    this.io.socket.post(path, data, (body, jwr) => {
      if (jwr.statusCode === 403) {
        this.authenticated = false;
      }
      callback(body, jwr);
    });
  }

  private doDelete(path : string, callback : Function) {
    this.io.socket.delete(path, (body, jwr) => {
      if (jwr.statusCode === 403) {
        this.authenticated = false;
      }
      callback(body, jwr);
    });
  }

  isAuthenticated() : Observable<boolean> {
    return new Observable(observer => {
      this.io.socket.get("/auth", (response, jwr) => {
        this.ngZone.run(() => {
          this.authenticated = response.authenticated;
          observer.next(this.authenticated);
          observer.complete();
        });
      });
    });
  }

  authenticate(password : string) : Observable<boolean> {
    if (this.authenticated) return Observable.of(true);
    return new Observable(observer => {
      this.doPost("/auth", { password }, (response, jwr) => {
        this.ngZone.run(() => {
          this.authenticated = response.authenticated;
          observer.next(this.authenticated);
          observer.complete();
        });
      });
    });
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
      this.doGet("/queue", (queues, jwr) => {
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
      this.doPost("/queue", queue, (queue, jwr) => {
        this.ngZone.run(() => {
          observer.next(queue);
        });
      });
    });
  }

  updateQueue(queue : any) : Observable<any> {
    return new Observable(observer => {
      this.doPost(`/queue/${queue.id}`, queue, (queues, jwr) => {
        this.ngZone.run(() => {
          observer.next(queues);
        });
      });
    });
  }

  deleteQueue(id : string) : Observable<any> {
    return new Observable(observer => {
      this.doDelete("/queue/" + id, (queues, jwr) => {
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
        });
        this.hasAttachedGroupsEvent[queueId] = true;
      }
      this.doGet(`/queue/${queueId}/group`, (groups, jwr) => {
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
      this.doPost("/group", group, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }

  deleteGroup(id : string) : Observable<any> {
    return new Observable(observer => {
      this.doDelete("/group/" + id, (groups, jwr) => {
        this.ngZone.run(() => {
          observer.next(groups);
        });
      });
    });
  }

  updateGroup(group : any) : Observable<any> {
    return new Observable(observer => {
      this.doPost(`/group/${group.id}`, group, (groups, jwr) => {
        this.ngZone.run(() => {
          observer.next(groups);
        });
      });
    });
  }

  reorderGroup(index : number, queueId : string, queueGroupId : string) : Observable<any> {
    return new Observable(observer => {
      this.doPost(`/queue/${queueId}/reorder`, {
        queueGroupId,
        index,
      }, (group, jwr) => {
        this.ngZone.run(() => {
          observer.next(group);
        });
      });
    });
  }

  nextGroupQueue(group : any) : Observable<any> {
    return new Observable(observer => {
      this.doPost(`/group/${group.id}/nextQueue`, group, (placeholder, jwr) => {
        this.ngZone.run(() => {
          observer.next(placeholder);
        });
      });
    })
  }

  nextBatch(queueId : string) : Observable<any> {
    return new Observable(observer => {
      this.doPost(`/queue/${queueId}/next`, {
        queueId,
      }, (batch, jwr) => {
        this.ngZone.run(() => {
          observer.next(batch);
        });
      });
    });
  }

  getBatchesByQueue(queueId : string) : Observable<any> {
    if (this.batchesObservables[queueId]) return this.batchesObservables[queueId];
    this.batchesObservables[queueId] = new Observable(observer => {
      if (! this.batchObservers[queueId]) this.batchObservers[queueId] = [];
      if (! this.batches[queueId]) this.batches[queueId] = [];

      this.batchObservers[queueId].push(observer);
      if (! this.hasAttachedBatchesEvent[queueId]) {
        this.io.socket.on("batch", event => {
          if (event.data && event.data.queue != queueId) return;
          this.ngZone.run(() => {
            this.updateCollection(this.batches[queueId], event);
            this.updateObservers(this.batchObservers[queueId], this.batches[queueId]);
          });
        });
        this.hasAttachedBatchesEvent[queueId] = true;
      }
      this.doGet(`/queue/${queueId}/batch`, (batches, jwr) => {
        this.ngZone.run(() => {
          this.batches[queueId] = _.clone(batches);
          this.updateObservers(this.batchObservers[queueId], this.batches[queueId]);
        });
      });
    });
    return this.batchesObservables[queueId];
  }

  getQueueGroupsForBatch(batchId : string) : Observable<any> {
    if (this.batchQueueGroupsObservables[batchId]) return this.batchQueueGroupsObservables[batchId];
    this.batchQueueGroupsObservables[batchId] = new Observable(observer => {
      if (! this.batchQueueGroupsObservers[batchId]) this.batchQueueGroupsObservers[batchId] = [];
      if (! this.batchQueueGroups[batchId]) this.batchQueueGroups[batchId] = [];

      this.batchQueueGroupsObservers[batchId].push(observer);
      if (! this.hasAttachedBatchQueueGroupsEvent[batchId]) {
        this.io.socket.on("queuegroup", event => {
          if (event.data && event.data.batch != batchId) return; // Ignore other batches
          this.ngZone.run(() => {
            this.updateCollection(this.batchQueueGroups[batchId], event);
            this.updateObservers(this.batchQueueGroupsObservers[batchId], this.batchQueueGroups[batchId]);
          });
        });
        this.io.socket.on("group", event => {
          // Only interested in update events; others covered by queueGroup events
          if (event.verb === "updated") {
            this.ngZone.run(() => {
              this.updateCollection(_.map(this.batchQueueGroups[batchId], "group"), event);
              this.updateObservers(this.batchQueueGroupsObservers[batchId], this.batchQueueGroups[batchId]);
            });
          }
        });
        this.io.socket.on("batch", event => {
          if (event.id != batchId) return; // Ignore other batches
          if (event.verb === "addedTo") {
            this.ngZone.run(() => {
              this.batchQueueGroups[batchId].push(event.added);
            });
          }
          if (event.verb === "removedFrom") {
            this.ngZone.run(() => {
              _.remove(this.batchQueueGroups[batchId], item => item.id == event.removedId);
            });
          }
        });
        this.hasAttachedBatchQueueGroupsEvent[batchId] = true;
      }
      this.doGet(`/batch/${batchId}/groups`, (batchQueueGroups, jwr) => {
        this.ngZone.run(() => {
          this.batchQueueGroups[batchId] = _.clone(batchQueueGroups);
          this.updateObservers(this.batchQueueGroupsObservers[batchId], this.batchQueueGroups[batchId]);
        });
      });
    });
    return this.batchQueueGroupsObservables[batchId];
  }

  addQueueGroupToBatch(batchId : string, queueGroupId : string) {
    return new Observable(observer => {
      this.doPost(`/batch/${batchId}/groups`, {
        queueGroupId,
      }, (queueGroup, jwr) => {
        this.ngZone.run(() => {
          observer.next(queueGroup);
        });
      });
    });
  }

  removeQueueGroupFromBatch(batchId : string, queueGroupId : string) {
    return new Observable(observer => {
      this.doDelete(`/batch/${batchId}/groups/${queueGroupId}`, (queueGroup, jwr) => {
        this.ngZone.run(() => {
          observer.next(queueGroup);
        });
      });
    });
  }

  autoPopulateBatch(batchId : string) {
    return new Observable(observer => {
      this.doPost(`/batch/${batchId}/populate`, {}, (addedQueueGroups, jwr) => {
        this.ngZone.run(() => {
          observer.next(addedQueueGroups);
        });
      });
    });
  }
}
