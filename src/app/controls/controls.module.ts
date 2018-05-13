import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { IconComponent } from './icon/icon.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabPageComponent } from './tabpage/tabpage.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DeleteButtonComponent, IconComponent, TabsComponent, TabPageComponent],
  exports: [
    DeleteButtonComponent,
    IconComponent,
    TabsComponent,
    TabPageComponent,
  ],
})
export class ControlsModule { }
