import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, connect, debounceTime, filter, merge, Observable, of, switchMap, tap } from 'rxjs';

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
  context: MachineContext = {
    state: 'idle',
    results: [],
    term: '',
    error: null
  }

  eventSubject = new BehaviorSubject<MachineEvents>({type: 'DEBOUNCE' as const, term: ''})
  contextSubject = new BehaviorSubject<Partial<typeof this.context>>({})

  constructor(private httpClient: HttpClient) {
    this.eventSubject.asObservable().pipe(connect((shared$ => merge(
      shared$.pipe(tap((val) => console.log('monitor', val))),
      shared$.pipe(
        filter((evt) => evt.type === 'TYPING'),
        tap(((evt) => {
          const typingEvent = evt as MachineTypingEvent
          const current = this.context
          this.contextSubject.next({...current, state: 'user-typing', term: typingEvent.term})
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
          const current = this.context
          this.contextSubject.next({ ...current, state: 'loading', term: loadingEvent.term })
        }),
        switchMap((evt) => {
          const term = (evt as MachineDebounceEvent).term
          return this.httpClient.get<MachineResults>(`https://rickandmortyapi.com/api/character/?name=${term}`).pipe(
            tap((res) => {
              const current = this.context
              this.contextSubject.next({...current, state: 'success', results: res.results})
            }),
            catchError((err: Response) => {
              console.log(err)
              const current = this.context
              this.contextSubject.next({...current, state: 'failure', error: err.statusText })
              return of([])
            })
          )
        })
      ),
    )))).subscribe()
  }

  getState(): Observable<Partial<MachineContext>> {
    return this.contextSubject.asObservable()
  }

  send(event: MachineEvents) {
    this.eventSubject.next(event)
  }
}
