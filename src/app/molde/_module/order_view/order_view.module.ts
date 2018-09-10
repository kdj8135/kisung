import { CommonModule } from '@angular/common';

import { Order_viewRouting } from './order_view.routing';
import { Order_viewComponent } from './order_view.component';

import { NgModule } from '@angular/core';
import {SmartadminModule} from "../../../shared/smartadmin.module";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../../shared/forms/input/smartadmin-input.module";

import { TreeViewModule } from '@progress/kendo-angular-treeview';


import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';

import { SortableModule } from '@progress/kendo-angular-sortable';

@NgModule({
  imports: [
    CommonModule,
    Order_viewRouting,
    //Order_viewComponent,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    TreeViewModule,
    UploadModule,
    FileAttachModule,
    SortableModule
  ],
exports: [Order_viewComponent],
declarations: [Order_viewComponent]
})
export class Order_viewModule { }
