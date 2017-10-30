import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ng2-dnd';
import { DisplayComponent } from './display/display.component';

@NgModule({
  imports: [
    CommonModule,
    DndModule,
  ],
  declarations: [DisplayComponent]
})
export class DisplayModule { }
