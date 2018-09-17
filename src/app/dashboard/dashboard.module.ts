import { CommonModule } from '@angular/common';

import { DashboardRouting } from './dashboard.routing';

import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "app/shared/smartadmin.module";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import {SmartadminInputModule} from "app/shared/forms/input/smartadmin-input.module";

import { TreeViewModule } from '@progress/kendo-angular-treeview';



import {Dashboard01Component} from "./molde_dashboard/dashboard01.component";
import {Dashboard02Component} from "./molde_dashboard/dashboard02.component";
import {Dashboard03Component} from "./molde_dashboard/dashboard03.component";
import {Dashboard04Component} from "./molde_dashboard/dashboard04.component";
import {Dashboard05Component} from "./molde_dashboard/dashboard05.component";

import {Order_selectModule} from "app/molde/_module/order_select/order_select.module";
import {OutsourcingAmtViewModule} from "app/molde/_module/outsourcing_amt_view/outsourcing_amt_view.module";

import { SelectdeptModule } from 'app/common/popup/selectdept/selectdept.module'; //팝업 dept

@NgModule({
  imports: [
    CommonModule,
    DashboardRouting,

    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminInputModule,
    TreeViewModule,
    Order_selectModule,
    OutsourcingAmtViewModule,
    SelectdeptModule
  ],
declarations: [Dashboard01Component, Dashboard02Component, Dashboard03Component, Dashboard04Component, Dashboard05Component],
bootstrap:    []
})
export class DashboardModule { }
