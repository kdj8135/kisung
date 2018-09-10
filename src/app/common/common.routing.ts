
import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";


export const routes:Routes = [
  { path: 'popup', loadChildren: './popup/popup.module#PopupModule', data: { pageTitle: '공통' } }
];

export const routing = RouterModule.forChild(routes);
