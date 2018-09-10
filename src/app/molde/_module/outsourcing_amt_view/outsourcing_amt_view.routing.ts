import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Outsourcing_Amt_View_Component } from '../outsourcing_amt_view/outsourcing_amt_view.component';

export const Outsourcing_Amt_View_Routes: Routes = [
  {path: 'outsourcing_amt_view', component: Outsourcing_Amt_View_Component, data: {pageTitle: '작업관리뷰'}}
];

export const Outsourcing_Amt_View_Routing = RouterModule.forChild(Outsourcing_Amt_View_Routes);
