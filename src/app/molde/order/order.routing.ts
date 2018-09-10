import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderlistComponent } from './orderlist/orderlist.component';
export const OrderRoutes: Routes = [
  {path: 'orderlist', component: OrderlistComponent, data: {pageTitle: '수주관리'}}
];

export const OrderRouting = RouterModule.forChild(OrderRoutes);
