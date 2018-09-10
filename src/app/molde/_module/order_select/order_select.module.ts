import { CommonModule } from '@angular/common';
import { Order_selectRouting } from './order_select.routing';
import { Order_selectComponent } from './order_select.component';


import { NgModule } from '@angular/core';
import {SmartadminModule} from "../../../shared/smartadmin.module";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../../shared/forms/input/smartadmin-input.module";


import { SortableModule } from '@progress/kendo-angular-sortable';

@NgModule({
  imports: [
    CommonModule,
    Order_selectRouting,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SortableModule
  ],
exports: [Order_selectComponent],
declarations: [Order_selectComponent]
})
export class Order_selectModule { }
