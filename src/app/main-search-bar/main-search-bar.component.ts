import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-main-search-bar',
  templateUrl: './main-search-bar.component.html',
  styleUrls: ['./main-search-bar.component.css']
})
export class MainSearchBarComponent implements OnInit {

  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
  }

  onChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement
    this.machineService.send(eventTarget.value)
  }
}
