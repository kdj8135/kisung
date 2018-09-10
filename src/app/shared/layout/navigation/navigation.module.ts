

import {NgModule, Pipe} from "@angular/core";
import {CommonModule} from "@angular/common";
import {I18nModule} from "../../i18n/i18n.module";
import {BigBreadcrumbsComponent} from "./big-breadcrumbs.component";
import {MinifyMenuComponent} from "./minify-menu.component";
import {NavigationComponent} from "./navigation.component";
import {SmartMenuDirective} from "./smart-menu.directive";
import {UserModule} from "../../user/user.module";
import {RouterModule} from "@angular/router";
// import {ChatModule} from "../../chat/chat.module";

//추가 : 상단에 있든 프로젝트 정보가 메뉴로 내려옴: 김동진
import {RecentProjectsComponent} from "../header/recent-projects/recent-projects.component";
import {BsDropdownModule} from "ngx-bootstrap";
@Pipe({
  name:"hashPath"
})
class HashPath{
  transform(value: string){
    if(value === undefined || value === null) value = "";
    return value.trim() === "" ? "#" : value;
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    UserModule,
    BsDropdownModule
    // ChatModule
  ],
  declarations: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    HashPath,
    RecentProjectsComponent
  ],
  exports: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
  ]
})
export class NavigationModule{}
