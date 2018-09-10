import {Component, OnInit} from '@angular/core';
import {LoginInfoComponent} from "../../user/login-info/login-info.component";

import {PmsApiService} from "../../../core/api/pms-api.service";

import { GlobalsVariable } from '../../helpers/index';
import { UserService } from "../../../shared/user/user.service";

@Component({
  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

  menus = [];
  isLoding = false;
  user: any;
  constructor(
    private pmsApiService:PmsApiService
    , private glObj: GlobalsVariable
    , private userService: UserService
  ) {
    this.user = userService.getLoginInfo();
  }

  ngOnInit() {
      let param = [{
        emp_no: this.user.empId
      }];
      this.pmsApiService.fetch('common/getmenutree', param).subscribe(result => {
        this.isLoding = true
        this.menus = JSON.parse(result.data)
      })
  }

  fnMenuClick(item){
    this.glObj.setClickMenuId(item.menuId);
    //console.log("fnMenuClick : " + this.glObj.getClickMenuId())
  }



}
