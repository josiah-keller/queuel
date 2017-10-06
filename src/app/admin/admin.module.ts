import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { ControlsModule } from '../controls/controls.module';

import { TopbarComponent } from './topbar/topbar.component';
import { AdminComponent } from './admin/admin.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { QueueViewComponent } from './queue-view/queue-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    AdminRoutingModule,

    ControlsModule,
  ],
  declarations: [
    TopbarComponent,
    AdminComponent,
    KioskComponent,
    ConfigurationComponent,
    PageContainerComponent,
    QueueViewComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
