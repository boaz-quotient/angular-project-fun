import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsItemsComponent } from './results-items.component';

describe('ResultsItemsComponent', () => {
  let component: ResultsItemsComponent;
  let fixture: ComponentFixture<ResultsItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
