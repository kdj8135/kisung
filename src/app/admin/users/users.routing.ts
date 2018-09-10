import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {UserlistComponent} from "./userlist/userlist.component";
import { RolelistComponent } from './rolelist/rolelist.component';
import { RoleassignComponent } from './roleassign/roleassign.component';
import { RoleassignuserComponent } from './roleassignuser/roleassignuser.component';
import { DeptlistComponent } from './deptlist/deptlist.component';

export const userRoutes: Routes = [
  {path: 'userlist', component: UserlistComponent, data: {pageTitle: '사용자 관리'}},
  {path: 'rolelist', component: RolelistComponent, data: {pageTitle: '역할권한관리'}},
  {path: 'roleassignuser', component: RoleassignuserComponent, data: {pageTitle: '사용자별 역할 설정'}},
  {path: 'roleassign', component: RoleassignComponent, data: {pageTitle: '역할별 사용자 설정'}},
  {path: 'deptlist', component: DeptlistComponent, data: {pageTitle: '조직도 관리'}}
];

export const userRouting = RouterModule.forChild(userRoutes);
