import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard01Component } from './molde_dashboard/dashboard01.component';
import { Dashboard02Component } from './molde_dashboard/dashboard02.component';
import { Dashboard03Component } from './molde_dashboard/dashboard03.component';
import { Dashboard04Component } from './molde_dashboard/dashboard04.component';
export const DashboardRoutes: Routes = [
  {path: 'molde_dashboard/dashboard01', component: Dashboard01Component, data: {pageTitle: '제조원가'}},
  {path: 'molde_dashboard/dashboard02', component: Dashboard02Component, data: {pageTitle: 'WT'}},
  {path: 'molde_dashboard/dashboard03', component: Dashboard03Component, data: {pageTitle: '담당자별 공정조회'}},
  {path: 'molde_dashboard/dashboard04', component: Dashboard04Component, data: {pageTitle: '공정별 공정조회'}}
];

export const DashboardRouting = RouterModule.forChild(DashboardRoutes);
