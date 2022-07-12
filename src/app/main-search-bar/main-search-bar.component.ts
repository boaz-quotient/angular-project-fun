import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-main-search-bar',
  templateUrl: './main-search-bar.component.html',
  styleUrls: ['./main-search-bar.component.css']
})
export class MainSearchBarComponent implements OnInit {

  constructor(private machineService: MachineService) { }

  getState() {
    return this.machineService.getState()
  }

  ngOnInit(): void {
  }

  onChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement
    this.machineService.send({type: 'TYPING', term: eventTarget.value})
  }
}
