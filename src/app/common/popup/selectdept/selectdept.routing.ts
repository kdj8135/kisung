import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectdeptComponent } from './selectdept.component';


export const Selectdeptroutes: Routes = [
  {path: 'selectdept', component: SelectdeptComponent, data: {pageTitle: '조직도'}}
];

export const Selectdeptrouting = RouterModule.forChild(Selectdeptroutes);
