import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';

export type Character = {
  gender: string,
  id: number,
  image: string,
  name: string,
  species: string,
  status: string,
  origin: { name: string },
  location: { name: string },
}

export type MachineResults = {
  info: {
    next?: string,
    prev?: string,
    count: number,
    pages: number,
  },
  results: Character[]
}

export type MachineContext = {
    state: string,
    results: Character[],
    next?: string,
    term: string,
    error: null | string
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  apiUrl = 'https://rickandmortyapi.com/api/character/'
  context: Partial<MachineContext> = { }

  eventSubject = new BehaviorSubject<string>('')
  contextSubject = new BehaviorSubject<Partial<typeof this.context>>({})

  constructor(private httpClient: HttpClient) {
    this.eventSubject.asObservable().pipe(
      tap(term => this.update({ state: 'user-typing', term })),
      debounceTime(500),
      tap(term => this.update({ state: 'loading', term })),
      switchMap(term => this.httpClient.get<MachineResults>(`${this.apiUrl}?name=${term}`).pipe(
        distinctUntilChanged(),
        tap(res => this.update({ state: 'success', next: res.info.next, results: res.results, term })),
        catchError((err: Response) => {
          this.update({ state: 'failure', error: err.statusText, term })
          return of([])
        })
      ))
    ).subscribe()
  }

  getState(): Observable<Partial<MachineContext>> {
    return this.contextSubject.asObservable()
  }

  send(searchTerm: string) {
    this.eventSubject.next(searchTerm)
  }

  private update(updates: Partial<MachineContext>) {
    this.context = {...this.context, ...updates}
    this.contextSubject.next(this.context)
  }
}
