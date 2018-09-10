import { CommonModule } from '@angular/common';

import { Product_Work_Routing } from './product_work.routing';

import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "../../shared/smartadmin.module";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";

import { TreeViewModule } from '@progress/kendo-angular-treeview';


import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';
import { SelectuserModule } from 'app/common/popup/selectuser/selectuser.module'; //팝업 user

import { product_work_listComponent } from './product_work_list/product_work_list.component';
import { product_out_work_listComponent } from './product_out_work_list/product_out_work_list.component';
import { product_my_work_listComponent } from './product_my_work_list/product_my_work_list.component';

import {ProductWorkViewModule} from "../_module/product_work_view/product_work_view.module";

@NgModule({
  imports: [
    CommonModule,
    Product_Work_Routing,
    ExcelModule,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    TreeViewModule,
    UploadModule,
    FileAttachModule,
    SelectuserModule,
    ProductWorkViewModule
  ],
declarations: [ product_work_listComponent, product_out_work_listComponent, product_my_work_listComponent],
bootstrap:    [ product_work_listComponent, product_out_work_listComponent, product_my_work_listComponent]
})
export class ProductWorkModule { }
