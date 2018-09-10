import { CommonModule } from '@angular/common';

import { OrderRouting } from './order.routing';

import {OrderlistComponent} from "./orderlist/orderlist.component";

import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "../../shared/smartadmin.module";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";

import { TreeViewModule } from '@progress/kendo-angular-treeview';


import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';


import {ProductplanComponent} from "./plan/productplan.component";
import {PlancopyComponent} from "./plancopy/plancopy.component";


import { SortableModule } from '@progress/kendo-angular-sortable';

import {Order_viewModule} from "../_module/order_view/order_view.module";
import {ProductWorkViewModule} from "../_module/product_work_view/product_work_view.module";
import {OutsourcingAmtViewModule} from "../_module/outsourcing_amt_view/outsourcing_amt_view.module";

@NgModule({
  imports: [
    CommonModule,
    OrderRouting,

    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    TreeViewModule,
    UploadModule,
    FileAttachModule,
    SortableModule,
    Order_viewModule,
    ProductWorkViewModule,
    OutsourcingAmtViewModule
  ],
declarations: [OrderlistComponent, ProductplanComponent, PlancopyComponent],
bootstrap:    [ OrderlistComponent ]
})
export class OrderModule { }
