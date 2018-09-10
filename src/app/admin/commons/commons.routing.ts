import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommoncodelistComponent } from './commoncodelist/commoncodelist.component';
import { StdprodlistComponent } from './stdprodlist/stdprodlist.component';
import { StdwbslistComponent } from './stdwbslist/stdwbslist.component';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
export const CommonsRoutes: Routes = [
  {path: 'commoncodelist', component: CommoncodelistComponent, data: {pageTitle: '공통코드'}},
  {path: 'stdprodlist', component: StdprodlistComponent, data: {pageTitle: '표준산출물관리'}},
  {path: 'stdwbslist', component: StdwbslistComponent, data: {pageTitle: '표준WBS관리'}},
  {path: 'vendorlist', component: VendorlistComponent, data: {pageTitle: '업체관리'}}
];

export const CommonsRouting = RouterModule.forChild(CommonsRoutes);
