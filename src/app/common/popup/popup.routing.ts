import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectdeptComponent } from './selectdept/selectdept.component';
import { SelectuserComponent } from './selectuser/selectuser.component';


export const popuproutes: Routes = [
  //{path: 'selectdept', component: SelectdeptComponent, data: {pageTitle: '조직도'}}
  { path: 'selectdept', loadChildren: 'app/common/popup/selectdept/selectdept.module#SelectdeptModule', data: { pageTitle: '조직도' } },
  { path: 'selectuser', loadChildren: 'app/common/popup/selectuser/selectuser.module#SelectuserModule', data: { pageTitle: '사용자조회' } }
];

export const popuprouting = RouterModule.forChild(popuproutes);
