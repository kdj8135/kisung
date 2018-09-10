import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes:Routes = [
  { path: 'sample-lists', loadChildren: 'app/sample/sample-lists/sample-lists.module#SampleListsModule', data: { pageTitle: 'Sample-Lists' } }
];

export const routing = RouterModule.forChild(routes);
