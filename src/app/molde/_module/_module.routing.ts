import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const _moduleRoutes: Routes = [
  { path: 'order_view', loadChildren: 'app/molde/_module/order_view/order_view.module#Order_viewModule', data: { pageTitle: '수주조회뷰' } },
  { path: 'order_select', loadChildren: 'app/molde/_module/order_select/order_select.module#Order_selectModule', data: { pageTitle: '수주선택' } },
  { path: 'product_work_view', loadChildren: 'app/molde/_module/product_work_view/product_work_view.module#ProductWorkViewModule', data: { pageTitle: '작업관리뷰' } },
  { path: 'outsourcing_amt_view', loadChildren: 'app/molde/_module/outsourcing_amt_view/outsourcing_amt_view.module#OutsourcingAmtViewModule', data: { pageTitle: '외주비용뷰' } }
];

export const _modulerouting = RouterModule.forChild(_moduleRoutes);
