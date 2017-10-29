import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KioskComponent } from "./kiosk/kiosk.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { EventStaffComponent } from "./event-staff/event-staff.component";

const routes : Routes = [
  {
    path: "kiosk",
    component: KioskComponent,
  },
  {
    path: "configuration",
    component: ConfigurationComponent,
  },
  {
    path: "event",
    component: EventStaffComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "kiosk",
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
