import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { product_work_listComponent } from './product_work_list/product_work_list.component';
import { product_out_work_listComponent } from './product_out_work_list/product_out_work_list.component';
import { product_my_work_listComponent } from './product_my_work_list/product_my_work_list.component';

export const Product_Work_Routes: Routes = [
  {path: 'product_work_list', component: product_work_listComponent, data: {pageTitle: '작업관리 '}},
  {path: 'product_out_work_list', component: product_out_work_listComponent, data: {pageTitle: '외주관리 '}},
  {path: 'product_my_work_list', component: product_my_work_listComponent, data: {pageTitle: '나의작업관리 '}}
];

export const Product_Work_Routing = RouterModule.forChild(Product_Work_Routes);
