//import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { userRouting } from './users.routing';
import {UserlistComponent} from "./userlist/userlist.component";
import { RolelistComponent } from './rolelist/rolelist.component';
import { RoleassignComponent } from './roleassign/roleassign.component';
import { RoleassignuserComponent } from './roleassignuser/roleassignuser.component';

import { NgModule, enableProdMode } from '@angular/core';
import {SmartadminModule} from "../../shared/smartadmin.module";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';


import { ModalModule } from "ngx-bootstrap";
import { Userlist_viewComponent } from "./userlist/userlist_view/userlist_view.component";
import { Userlist_regComponent } from "./userlist/userlist_reg/userlist_reg.component";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import { DeptlistComponent } from './deptlist/deptlist.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

//import { SelectdeptComponent } from 'app/common/popup/selectdept/selectdept.component'; //팝업 dept
import { SelectdeptModule } from 'app/common/popup/selectdept/selectdept.module'; //팝업 dept


import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';



@NgModule({
  imports: [
    CommonModule,
    userRouting

    ,
    SmartadminModule,
    HttpClientModule,
    GridModule,
    ModalModule,
    SmartadminValidationModule,
    TreeViewModule
    ,UploadModule
    ,FileAttachModule
    ,SelectdeptModule
  ],
declarations: [UserlistComponent, RolelistComponent, RoleassignComponent, RoleassignuserComponent

  ,Userlist_viewComponent
  ,Userlist_regComponent, DeptlistComponent
  //,SelectdeptComponent
],
bootstrap:    [ UserlistComponent ]
})
export class UsersModule { }
