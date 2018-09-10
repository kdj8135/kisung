import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguagesRouting } from './languages.routing';
import { LanguagemanageComponent } from './languagemanage/languagemanage.component';
import { MenulanguagemanageComponent } from './menulanguagemanage/menulanguagemanage.component';

import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { GridModule } from '@progress/kendo-angular-grid';
import { ModalModule } from "ngx-bootstrap";
import { SmartadminModule} from "../../shared/smartadmin.module";
//import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    LanguagesRouting
    ,TreeViewModule
    ,GridModule
    ,ModalModule
    ,SmartadminModule
    //,HttpClientModule
  ],
  declarations: [
    LanguagemanageComponent,
    MenulanguagemanageComponent
],
  bootstrap:    []
})
export class LanguagesModule { }
