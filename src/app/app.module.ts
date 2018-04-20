import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DndModule } from 'ng2-dnd';

import { AppRoutingModule } from './app-routing.module';

import { RealtimeService } from './services/realtime.service';
import { AuthGuard } from './auth.guard';

import { AdminModule } from './admin/admin.module';
import { DisplayModule } from './display/display.module';
import { ControlsModule } from './controls/controls.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    DndModule.forRoot(),
    
    AppRoutingModule,

    DisplayModule,
    ControlsModule,
  ],
  providers: [
    RealtimeService,
    AuthGuard,
  ],
  exports: [
    DndModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
