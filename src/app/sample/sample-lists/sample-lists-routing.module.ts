import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SamplelistComponent} from "./samplelist/samplelist.component";

const routes: Routes = [
  {
    path: 'samplelist', component: SamplelistComponent, data: {pageTitle: 'SampleList'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleListsRoutingModule { }
