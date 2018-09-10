//import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRouting } from './dashboard.routing';

import {PracticalTongPersonListComponent} from "./practicaltongpersonList/practicaltongpersonList.component";


import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "../../shared/smartadmin.module";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';

import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
//import { DeptlistComponent } from './deptlist/deptlist.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

import { SelectdeptModule } from 'app/common/popup/selectdept/selectdept.module'; //팝업 dept

import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';

import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";


@NgModule({
  imports: [
    CommonModule,
    dashboardRouting,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    TreeViewModule
    ,UploadModule
    ,FileAttachModule
    ,SelectdeptModule
    ,SmartadminInputModule
  ],
  exports: [
    //UiDatepickerDirective
  ],
declarations: [PracticalTongPersonListComponent
  //, DeptlistComponent
],
bootstrap:    []
})
export class DashboardModule { }
