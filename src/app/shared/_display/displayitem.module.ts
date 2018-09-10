import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DisplayitemPipe} from "./displayitem.pipe";
import {DisplayitemService} from "./displayitem.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DisplayitemPipe],
  exports: [DisplayitemPipe],
  providers: [DisplayitemService]
})
export class DisplayitemModule { }
