/**
 * Created by griga on 7/11/16.
 */

import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {EmptyLayoutComponent} from "./shared/layout/app-layouts/empty-layout.component";
import {ModuleWithProviders} from "@angular/core";
import { PmsAuthGuard } from './shared/helpers/index';


//import {FileAttachComponent} from "./fileattach/fileattach.component";

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [PmsAuthGuard],
        children: [
            {
                path: '', redirectTo: 'home', pathMatch: 'full'
            },

            // {
            //   path: 'upload', component: FileAttachComponent, data: {pageTitle: '사용자 관리'}
            // },

            {
                path: 'home',
                loadChildren: 'app/+home/home.module#HomeModule',
                data: {pageTitle: 'Home'}
            },
            {
                path: 'admin',
                loadChildren: 'app/admin/admin.module#AdminModule',
                data: {pageTitle: 'Admin'}
            },
            {
                path: 'common',
                loadChildren: 'app/common/common.module#CommonModule',
                data: {pageTitle: 'Common'}
            },
            {
                path: 'sample',
                loadChildren: 'app/sample/sample.module#SampleModule',
                data: {pageTitle: 'Sample'}
            },
            {
                path: 'pmo',
                loadChildren: 'app/pmo/pmo.module#PmoModule',
                data: {pageTitle: 'Pmo'}
            },
            {
                path: 'molde',
                loadChildren: 'app/molde/molde.module#MoldeModule',
                data: {pageTitle: '작업관리'}
            },
            {
                path: 'dashboard',
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
                data: {pageTitle: 'Dashboard'}
            },
        ]
    },

    {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/auth/auth.module#AuthModule'}

    ,{path: 'popup', component: EmptyLayoutComponent, loadChildren: 'app/admin/admin.module#AdminModule'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true, });
