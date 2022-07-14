import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineContext, MachineService } from '../machine.service';

@Component({
  selector: 'app-results-items',
  templateUrl: './results-items.component.html',
  styleUrls: ['./results-items.component.css']
})
export class ResultsItemsComponent implements OnInit {

  context$: Observable<Partial<MachineContext>> = of({})
  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
    this.context$ = this.machineService.getState()
  }

}
