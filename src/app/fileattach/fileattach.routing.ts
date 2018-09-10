import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileAttachComponent } from './fileattach.component';


export const routes: Routes = [
  {path: 'fileattach', component: FileAttachComponent, data: {pageTitle: '파일업로드'}}
];

export const routing = RouterModule.forChild(routes);
