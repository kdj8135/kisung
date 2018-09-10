import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {routing} from "./auth.routing";
import { AuthComponent } from './auth.component';

import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule
  ],
  declarations: [ AuthComponent]
})
export class AuthModule { }
