import { NgModule } from '@angular/core';

import {routing} from "./molde.routing";
import { SelectuserModule } from 'app/common/popup/selectuser/selectuser.module'; //팝업 dept

@NgModule({
  imports: [
    routing
    ,SelectuserModule
  ],
  declarations: [

  ]
})
export class MoldeModule { }
