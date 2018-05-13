import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPageComponent } from './tabpage.component';

describe('TabPageComponent', () => {
  let component: TabPageComponent;
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
