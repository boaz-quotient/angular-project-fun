import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl = 'https://rickandmortyapi.com/api/character/'

  constructor() { }
}
