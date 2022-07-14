import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from './types';

export type Context = {
    state: string,
    term: string,
    results?: Character[],
    next?: string,
    error?: string
}

export const initContext: Context = {state: 'init', term: ''}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private store: Context = initContext
  private contextSubject = new BehaviorSubject<Context>(this.store)

  context$ = this.contextSubject.asObservable()

  constructor() {
    this.context$.subscribe(v => console.log(v))
  }

  update(context: Partial<Context>) {
    this.store = {...this.store, ...context}
    this.contextSubject.next(this.store)
  }
}
