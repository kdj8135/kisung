import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";

export const routes:Routes = [
  { path: 'order', loadChildren: 'app/molde/order/order.module#OrderModule', data: { pageTitle: '수주관리' } }
  ,{ path: 'product_work', loadChildren: 'app/molde/product_work/product_work.module#ProductWorkModule', data: { pageTitle: '작업관리' } }
  ,{ path: 'board', loadChildren: 'app/molde/board/board.module#BoardModule', data: { pageTitle: '게시판' } }
];

export const routing = RouterModule.forChild(routes);
