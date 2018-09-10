import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";

export const routes:Routes = [
  { path: 'dashboard', loadChildren: 'app/pmo/dashboard/dashboard.module#DashboardModule', data: { pageTitle: 'Dashboard' } },
];

export const routing = RouterModule.forChild(routes);
