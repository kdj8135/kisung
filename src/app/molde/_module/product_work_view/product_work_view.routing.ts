import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Product_Work_View_Component } from '../product_work_view/product_work_view.component';

export const Product_Work_View_Routes: Routes = [
  {path: 'product_work_view', component: Product_Work_View_Component, data: {pageTitle: '작업관리뷰'}}
];

export const Product_Work_View_Routing = RouterModule.forChild(Product_Work_View_Routes);
