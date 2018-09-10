import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";
import {CalendarComponent} from "./calendar.component";
import {CalendarModule} from "./calendar.module";


export const routes: Routes = [

  {
    //path: '',component: CalendarComponent,data: {pageTitle: 'Calendar'}
    path: 'My Events',loadChildren: 'app/+calendar/calendar.module#CalendarModule',data: {pageTitle: 'Calendar'}
  },


];

export const routing = RouterModule.forChild(routes);
