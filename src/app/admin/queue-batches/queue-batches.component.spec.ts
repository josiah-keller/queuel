import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueBatchesComponent } from './queue-batches.component';

describe('QueueBatchesComponent', () => {
  let component: QueueBatchesComponent;
  let fixture: ComponentFixture<QueueBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
