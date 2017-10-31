import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard';

import { KioskComponent } from "./kiosk/kiosk.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { EventStaffComponent } from "./event-staff/event-staff.component";
import { LoginComponent } from './login/login.component';

const routes : Routes = [
  {
    path: "kiosk",
    component: KioskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "configuration",
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "event",
    component: EventStaffComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
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
