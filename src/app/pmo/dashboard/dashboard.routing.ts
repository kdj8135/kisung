import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PracticalTongPersonListComponent} from "./practicaltongpersonList/practicaltongpersonList.component";

export const dashboardRoutes: Routes = [
  {path: 'practicaltongpersonList', component: PracticalTongPersonListComponent, data: {pageTitle: '사용통계'}},
];

export const dashboardRouting = RouterModule.forChild(dashboardRoutes);
