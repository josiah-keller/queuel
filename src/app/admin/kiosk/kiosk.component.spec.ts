import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskComponent } from './kiosk.component';

describe('KioskComponent', () => {
  let component: KioskComponent;
  let fixture: ComponentFixture<KioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
