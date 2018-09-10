import { CommonModule } from '@angular/common';

import { Outsourcing_Amt_View_Routing } from './outsourcing_amt_view.routing';
import { Outsourcing_Amt_View_Component } from '../outsourcing_amt_view/outsourcing_amt_view.component';

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

@NgModule({
  imports: [
    CommonModule,
    Outsourcing_Amt_View_Routing,

    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    TreeViewModule,
    UploadModule,
    FileAttachModule,
  ],
declarations: [Outsourcing_Amt_View_Component],
exports: [Outsourcing_Amt_View_Component],
bootstrap:    [ Outsourcing_Amt_View_Component]
})
export class OutsourcingAmtViewModule { }
