import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";
import {I18nModule} from "../../shared/i18n/i18n.module";

import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    I18nModule,
    SmartadminLayoutModule
  ],
  declarations: [LoginComponent],
  exports:[

  ],
  providers: [AuthService]
})
export class LoginModule { }
