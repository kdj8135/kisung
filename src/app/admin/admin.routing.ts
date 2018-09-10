import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";

export const routes:Routes = [
  { path: 'users', loadChildren: 'app/admin/users/users.module#UsersModule', data: { pageTitle: '사용자/권한관리' } },
  { path: 'commons', loadChildren: 'app/admin/commons/commons.module#CommonsModule', data: { pageTitle: '표준관리' } },
  { path: 'languages', loadChildren: 'app/admin/languages/languages.module#LanguagesModule', data: { pageTitle: '다국어관리' } },
];

export const routing = RouterModule.forChild(routes);
