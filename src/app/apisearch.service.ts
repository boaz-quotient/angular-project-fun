import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Character } from './types';

export type SuccessResult = {
  info: {
    next?: string,
    prev?: string,
    count: number,
    pages: number,
  },
  results: Character[]
}

export type ErrorResult = Response

export const ResultType = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
} as const

export type ApiResults = {
  type: typeof ResultType.SUCCESS,
  data: SuccessResult
} | {
  type: typeof ResultType.FAILURE,
  data: ErrorResult
}

@Injectable({
  providedIn: 'root'
})
export class ApisearchService {
  private urlSubject = new Subject<string>()

  results$: Observable<ApiResults> = this.urlSubject.asObservable().pipe(
      switchMap(url => this.httpService.get<SuccessResult>(url).pipe(
        map(res => {
          return { type: ResultType.SUCCESS, data: res}
        }),
        catchError((err: ErrorResult) => {
          return of({type:ResultType.FAILURE, data: err})
        })
      ))
    )

  constructor(private httpService: HttpClient) {
  }

  fetch(url: string) {
    this.urlSubject.next(url)
  }
}
