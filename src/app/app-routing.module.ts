import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from "./admin/admin/admin.component";
import { DisplayComponent } from "./display/display/display.component";

const routes : Routes = [
  {
    path: "admin",
    component: AdminComponent,
    loadChildren: "app/admin/admin.module#AdminModule",
  },
  {
    path: "display",
    component: DisplayComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/admin",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
