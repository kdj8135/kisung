import { Injectable } from '@angular/core';

import EVENTS_MOCK from './EVENTS_MOCK';
import { externalEvents } from './EXTERNAL_EVENTS_MOCK';
import { Subject } from "rxjs/Subject";


@Injectable()
export class EventsService {

  public store: any = {
    events: EVENTS_MOCK,
    externalEvents: externalEvents,
    removeAfterDrop: false,
  };

  private subject;

  constructor() {
    console.log(1);
    this.subject = new Subject();
  }

  subscribe(next, error?, complete?) {
    console.log(2);
    return this.subject.subscribe(next, error, complete)
  }

  addEvent(event) {
    console.log(3);
    const dropId = event.id;
    event.id = this.generateId();
    this.store.events.push(event);

    if (this.store.removeAfterDrop) {
      this.store.externalEvents.splice(this.store.externalEvents.findIndex(it => it.id == dropId), 1);
    }

    this.subject.next(this.store);
  }

  addExternalEvent(event) {
    console.log(4);
    this.store.externalEvents.push(event)
    this.subject.next(this.store)
  }

  setRemoveAfterDrop(value) {
    console.log(5);
    this.store.removeAfterDrop = value;
    this.subject.next(this.store);
  }


  generateId() {
    console.log(6);
    return Math.random().toString(36).slice(2)
  }
}
