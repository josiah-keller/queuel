import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { RealtimeService } from './services/realtime.service';

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
    HttpModule,
    BrowserAnimationsModule,
    
    AppRoutingModule,

    AdminModule,
    DisplayModule,
    ControlsModule,
  ],
  providers: [
    RealtimeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
