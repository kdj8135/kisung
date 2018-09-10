import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguagemanageComponent } from './languagemanage/languagemanage.component';
import { MenulanguagemanageComponent } from './menulanguagemanage/menulanguagemanage.component';

export const LanguagesRoutes: Routes = [
  {path: 'languagemanage', component: LanguagemanageComponent, data: {pageTitle: '시스템다국어설정'}},
  {path: 'menulanguagemanage', component: MenulanguagemanageComponent, data: {pageTitle: '메뉴다국어설정'}}
];

export const LanguagesRouting = RouterModule.forChild(LanguagesRoutes);
