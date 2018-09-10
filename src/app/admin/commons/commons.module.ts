import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsRouting } from './commons.routing';
import { CommoncodelistComponent } from './commoncodelist/commoncodelist.component';
import { CommoncodelistMainRegComponent } from './commoncodelist/commoncodelist-main-reg/commoncodelist-main-reg.component';
import { CommoncodelistSubRegComponent } from './commoncodelist/commoncodelist-sub-reg/commoncodelist-sub-reg.component'; //넓이
import { StdprodlistComponent } from './stdprodlist/stdprodlist.component';
import { StdwbslistComponent } from './stdwbslist/stdwbslist.component';
import { VendorlistComponent } from './vendorlist/vendorlist.component';

import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { GridModule } from '@progress/kendo-angular-grid';
import { ModalModule } from "ngx-bootstrap";
import { HttpClientModule } from '@angular/common/http';
import { SmartadminModule} from "../../shared/smartadmin.module";

import { NgDaumAddressModule } from 'ng2-daum-address';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
@NgModule({
  imports: [
    CommonModule,
    CommonsRouting

    ,GridModule
    ,TreeViewModule
    ,ModalModule
    ,HttpClientModule
    ,SmartadminModule
    ,SmartadminValidationModule
    ,NgDaumAddressModule
    ,SmartadminInputModule
  ],
  declarations: [
    CommoncodelistComponent,
    CommoncodelistMainRegComponent,
    CommoncodelistSubRegComponent,
    StdprodlistComponent,
    StdwbslistComponent,
    VendorlistComponent
],
  bootstrap:    [CommoncodelistComponent]
})
export class CommonsModule { }
