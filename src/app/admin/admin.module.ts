import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TopbarComponent,
    AdminComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
