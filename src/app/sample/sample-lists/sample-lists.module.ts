import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleListsRoutingModule } from './sample-lists-routing.module';
import { SamplelistComponent } from './samplelist/samplelist.component';
import { Samplelist2Component } from './samplelist2/samplelist2.component';

@NgModule({
  imports: [
    CommonModule,
    SampleListsRoutingModule
  ],
  declarations: [SamplelistComponent, Samplelist2Component]
})
export class SampleListsModule { }
