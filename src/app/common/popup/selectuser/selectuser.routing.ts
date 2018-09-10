import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectuserComponent } from './selectuser.component';


export const Selectuserroutes: Routes = [
  {path: 'selectuser', component: SelectuserComponent, data: {pageTitle: '사용자조회'}}
];

export const Selectuserrouting = RouterModule.forChild(Selectuserroutes);
