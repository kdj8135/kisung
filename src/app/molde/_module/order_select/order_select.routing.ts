import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Order_selectComponent } from './order_select.component';
export const Order_selectRoutes: Routes = [
  {path: 'order_select', component: Order_selectComponent, data: {pageTitle: '수주선택'}}
];

export const Order_selectRouting = RouterModule.forChild(Order_selectRoutes);
