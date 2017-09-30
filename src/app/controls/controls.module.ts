import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DeleteButtonComponent],
  exports: [
    DeleteButtonComponent,
  ],
})
export class ControlsModule { }
