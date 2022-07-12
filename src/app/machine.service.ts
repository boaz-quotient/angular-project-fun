import { Injectable } from '@angular/core';
import { BehaviorSubject, connect, debounceTime, filter, merge, tap } from 'rxjs';

export type MachineEvents = {type: 'LOADING'} | {type: 'TYPING', term: string} | {type: 'DEBOUNCE'}
export type MachineEventTypes = 'LOADING' | 'TYPING' | 'DEBOUNCED'

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  context = {
    state: 'idle',
    results: [] as any[],
    term: '',
  }

  eventSubject = new BehaviorSubject<MachineEvents>({type: 'LOADING' as const})

  constructor() {
    this.eventSubject.asObservable().pipe(connect((shared$ => merge(
      shared$.pipe(tap((val) => console.log('monitor', val))),
      shared$.pipe(
        filter((evt) => evt.type === 'TYPING'),
        tap(((evt) => {
          this.context.state = 'user-typing'
          if (evt.type === 'TYPING') {
            this.context.term = evt.term
          }
        })),
        debounceTime(500),
        tap(() => {
          this.send({type: 'DEBOUNCE'})
        })
      ),
      shared$.pipe(filter((evt) => evt.type === 'DEBOUNCE'), tap(() => this.context.state = 'loading'))
    )))).subscribe()
  }

  getState() {
    return this.context
  }

  send(event: MachineEvents) {
    console.log('sending ', event)
    this.eventSubject.next(event)
  }

}
