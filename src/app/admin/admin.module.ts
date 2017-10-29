import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';

import { AdminRoutingModule } from './admin-routing.module';

import { ControlsModule } from '../controls/controls.module';

import { TopbarComponent } from './topbar/topbar.component';
import { AdminComponent } from './admin/admin.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { QueueViewComponent } from './queue-view/queue-view.component';
import { QueueStatusComponent } from './queue-status/queue-status.component';
import { GroupEditorComponent } from './group-editor/group-editor.component';
import { EventStaffComponent } from './event-staff/event-staff.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DndModule.forRoot(),

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
    QueueStatusComponent,
    GroupEditorComponent,
    EventStaffComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
