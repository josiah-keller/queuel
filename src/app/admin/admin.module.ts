import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';

import { TopbarComponent } from './topbar/topbar.component';
import { AdminComponent } from './admin/admin.component';
import { KioskComponent } from './kiosk/kiosk.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    AdminRoutingModule,
  ],
  declarations: [
    TopbarComponent,
    AdminComponent,
    KioskComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
