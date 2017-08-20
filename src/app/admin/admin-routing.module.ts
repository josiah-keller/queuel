import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KioskComponent } from "./kiosk/kiosk.component";

const routes : Routes = [
  {
    path: "kiosk",
    component: KioskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
