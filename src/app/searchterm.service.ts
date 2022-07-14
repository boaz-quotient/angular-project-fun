import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { Action, ActionTypes } from './types';
import { ApisearchService } from './apisearch.service';
import { ConfigService } from './config.service';
import { ContextService } from './context.service';

@Injectable({
  providedIn: 'root'
})
export class SearchtermService {
  private searchTermSubject = new BehaviorSubject('')

  termChangedAction$: Observable<Action> = this.searchTermSubject.asObservable().pipe(
      tap(term => this.ctxSvc.update({ state: 'user-typing', term })),
      map(term => ({action: ActionTypes.TYPING, term, url: `${this.configSvc.apiUrl}?name=${term}`})),
  )

  constructor(private configSvc: ConfigService, private ctxSvc: ContextService) { }

  update(searchTerm: string) {
    this.searchTermSubject.next(searchTerm)
  }
}
