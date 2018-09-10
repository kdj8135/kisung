import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MlangPipe} from "./mlang.pipe";
import {MlangService} from "./mlang.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MlangPipe],
  exports: [MlangPipe],
  providers: [MlangService]
})
export class MlangModule { }
