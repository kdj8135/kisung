//import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRouting } from './board.routing';
import { BoardListComponent} from "./board_list/board_list.component";
import { board_viewComponent } from "./board_view/board_view.component";
import { board_regComponent } from "./board_reg/board_reg.component";

import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "../../shared/smartadmin.module";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';
import { ModalModule } from "ngx-bootstrap";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';
import {SmartadminEditorsModule} from "../../shared/forms/editors/smartadmin-editors.module";


@NgModule({
  imports: [
    CommonModule,
    BoardRouting,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    TreeViewModule
    ,UploadModule
    ,FileAttachModule
    ,SmartadminEditorsModule
  ],
declarations: [BoardListComponent

  ,board_viewComponent
  ,board_regComponent

],
bootstrap:    [ BoardListComponent ]
})
export class BoardModule { }
