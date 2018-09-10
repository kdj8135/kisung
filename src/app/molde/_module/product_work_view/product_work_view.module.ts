import { CommonModule } from '@angular/common';

import { Product_Work_View_Routing } from './product_work_view.routing';

import { Product_Work_View_Component } from '../product_work_view/product_work_view.component';

import { NgModule, enableProdMode } from '@angular/core';
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
import { SelectuserModule } from 'app/common/popup/selectuser/selectuser.module'; //팝업 user

@NgModule({
  imports: [
    CommonModule,
    Product_Work_View_Routing,

    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    TreeViewModule,
    UploadModule,
    FileAttachModule,
    SelectuserModule
  ],
declarations: [Product_Work_View_Component],
exports: [Product_Work_View_Component],
bootstrap:    [ Product_Work_View_Component]
})
export class ProductWorkViewModule { }
