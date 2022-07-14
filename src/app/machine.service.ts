import { Injectable } from '@angular/core';
import { connect, debounceTime, filter, merge, Observable, Subject, tap } from 'rxjs';
import { ApisearchService, ResultType } from './apisearch.service';
import { Context, ContextService } from './context.service';
import { SearchtermService } from './searchterm.service';
import { ActionTypes } from './types';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  loadMore = new Subject<string>()

  constructor(private searchTermSvc: SearchtermService, private ctxSvc: ContextService, apiSearchSvc: ApisearchService) {
    apiSearchSvc.results$.pipe(
      tap(apiRes => {
        if (apiRes.type === ResultType.FAILURE) {
          ctxSvc.update({ state: 'failure', error: apiRes.data.statusText })
        }
        if (apiRes.type === ResultType.SUCCESS) {
          ctxSvc.update({ state: 'success', results: apiRes.data.results, next: apiRes.data.info.next })
        }
      })
    ).subscribe()

    merge(this.searchTermSvc.termChangedAction$).pipe(connect(bus$ => merge(
      bus$.pipe(tap(val => console.log(val))),
      bus$.pipe(
        filter(({ action: actionType })=> actionType === ActionTypes.TYPING),
        tap(({ term }) => ctxSvc.update({ state: 'user-typing', term })),
        debounceTime(500),
        tap(({ term }) => ctxSvc.update({ state: 'loading', term })),
        tap(({ url }) => apiSearchSvc.fetch(url)),
      )
    ))).subscribe()
  }

  getState(): Observable<Context> {
    return this.ctxSvc.context$
  }

  send(searchTerm: string) {
    this.searchTermSvc.update(searchTerm)
  }

  loadMoreCharacters() {
  }
}
