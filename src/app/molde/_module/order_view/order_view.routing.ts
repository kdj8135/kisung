import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Order_viewComponent } from './order_view.component';
export const Order_viewRoutes: Routes = [
  {path: 'order_view', component: Order_viewComponent, data: {pageTitle: '수주관리조회'}}
];

export const Order_viewRouting = RouterModule.forChild(Order_viewRoutes);
