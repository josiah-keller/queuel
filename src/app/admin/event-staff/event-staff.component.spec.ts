import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStaffComponent } from './event-staff.component';

describe('EventStaffComponent', () => {
  let component: EventStaffComponent;
  let fixture: ComponentFixture<EventStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
