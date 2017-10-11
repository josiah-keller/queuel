import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DeleteButtonComponent, IconComponent],
  exports: [
    DeleteButtonComponent,
    IconComponent,
  ],
})
export class ControlsModule { }
