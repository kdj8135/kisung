import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Selectdeptrouting } from './selectdept.routing';
import { SelectdeptComponent } from './selectdept.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@NgModule({
  imports: [
    CommonModule,
    Selectdeptrouting,
    TreeViewModule
  ],
  exports: [
        SelectdeptComponent
    ],
  declarations: [SelectdeptComponent]
})
export class SelectdeptModule { }
