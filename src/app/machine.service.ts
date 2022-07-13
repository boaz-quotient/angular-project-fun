import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, connect, debounceTime, filter, merge, Observable, of, share, switchMap, tap, zip } from 'rxjs';

export type MachineResults = {
  info: {
    next?: string,
    prev?: string,
    count: number,
    pages: number,
  },
  results: {
    gender: string,
    id: number,
    image: string,
    name: string,
    species: string,
    status: string,
    origin: { name: string },
    location: { name: string },
  }[]
}
export type MachineTypingEvent = {type: 'TYPING', term: string}
export type MachineDebounceEvent = {type: 'DEBOUNCE', term: string}
export type MachineEvents = {type: 'LOADING'} | MachineTypingEvent | MachineDebounceEvent
export type MachineEventTypes = 'LOADING' | 'TYPING' | 'DEBOUNCED'

export type MachineContext = {
    state: string,
    results: any[],
    term: string,
    error: null | string
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  context: Partial<MachineContext> = { }

  eventSubject = new BehaviorSubject<MachineEvents>({type: 'DEBOUNCE' as const, term: ''})
  contextSubject = new BehaviorSubject<Partial<typeof this.context>>({})

  constructor(private httpClient: HttpClient) {
    this.eventSubject.asObservable().pipe(connect(shared$ => merge(
      // shared$.pipe(tap((val) => console.log('monitor', val))),
      shared$.pipe(
        filter((evt) => evt.type === 'TYPING'),
        tap(((evt) => {
          const typingEvent = evt as MachineTypingEvent
          this.update({ state: 'user-typing', term: typingEvent.term })
        })),
        debounceTime(500),
        tap((evt) => {
          this.send({type: 'DEBOUNCE', term: (evt as MachineTypingEvent).term})
        })
      ),
      shared$.pipe(
        filter((evt) => evt.type === 'DEBOUNCE'),
        tap((evt) => {
          const loadingEvent = evt as MachineDebounceEvent
          this.update({ state: 'loading', term: loadingEvent.term })
        }),
        switchMap((evt) => {
          const term = (evt as MachineDebounceEvent).term
          return this.httpClient.get<MachineResults>(`https://rickandmortyapi.com/api/character/?name=${term}`).pipe(
            tap((res) => {
              this.update({ state: 'success', results: res.results, term})
            }),
            catchError((err: Response) => {
              console.log(err)
              this.update({ state: 'failure', error: err.statusText, term })
              return of([])
            })
          )
        })
      ),
    ))).subscribe()
  }

  getState(): Observable<Partial<MachineContext>> {
    return this.contextSubject.asObservable()
  }

  send(event: MachineEvents) {
    this.eventSubject.next(event)
  }

  private update(updates: Partial<MachineContext>) {
    this.context = {...this.context, ...updates}
    this.contextSubject.next(this.context)
  }
}
