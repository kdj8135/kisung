import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { homeRouting } from './home.routing';
import {SmartadminModule} from "../shared/smartadmin.module";
import {HomeComponent} from "./home.component";

//첨부파일 추가
import { UploadModule } from '@progress/kendo-angular-upload';
import { FileAttachModule } from 'app/fileattach/fileattach.module';

//첫번째 그래프
import {FlotChartModule} from "../shared/graphs/flot-chart/flot-chart.module";
//두번째 카렌다
import {CalendarModule} from "../+calendar/calendar.module";
//세번째 투두
import { TodoWidgetComponent } from './todo-widget/todo-widget.component';
import { TodoListComponent } from './todo-widget/todo-list.component';

import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            pageTitle: 'Home'
        },
        runGuardsAndResolvers: 'always',
    }
];


@NgModule({
  imports: [
    CommonModule,
  //  homeRouting,
    SmartadminModule

     ,UploadModule
     ,FileAttachModule
     ,[RouterModule.forChild(routes)]
     ,FlotChartModule //첫번째 그래프
     ,CalendarModule //두번째 카렌다
  ],
  declarations: [HomeComponent
    //  , FileAttachComponent
    ,TodoWidgetComponent //세번째 투두
    ,TodoListComponent //세번째 투두
  ],
  exports: [RouterModule]
})
export class HomeModule { }
