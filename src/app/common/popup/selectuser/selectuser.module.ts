import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Selectuserrouting } from './selectuser.routing';
import { SelectuserComponent } from './selectuser.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule } from '@angular/forms';
import {SmartadminModule} from "../../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
    Selectuserrouting,
    TreeViewModule,
    GridModule,
    Selectuserrouting,
    FormsModule,
    SmartadminModule
  ],
  exports: [
        SelectuserComponent
    ],
  declarations: [SelectuserComponent]
})
export class SelectuserModule { }
