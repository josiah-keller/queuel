import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';

import { TopbarComponent } from './topbar/topbar.component';
import { AdminComponent } from './admin/admin.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { PageContainerComponent } from './page-container/page-container.component';

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
    ConfigurationComponent,
    PageContainerComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
