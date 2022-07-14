import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineContext, MachineService } from '../machine.service';

@Component({
  selector: 'app-results-items',
  templateUrl: './results-items.component.html',
  styleUrls: ['./results-items.component.css'],
})
export class ResultsItemsComponent implements OnInit {

  selectedCharacter: number | null = null
  context$: Observable<Partial<MachineContext>> = of({})
  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
    this.context$ = this.machineService.getState()
  }

  selectCharacter(id: number) {
    if (this.selectedCharacter === id) {
      this.selectedCharacter = null
    } else {
      this.selectedCharacter = id
    }
  }

  loadMore() {
    this.machineService.loadMoreCharacters()
  }
}
