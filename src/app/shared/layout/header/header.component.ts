import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router
  ,private pmsApiService: PmsApiService
  ,private userService: UserService) {
    this.user = userService.getLoginInfo();
  }

  ngOnInit() {
  }

  user: any;
  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }

  private LogOut(): void {

    let param = [{
      emp_no: this.user.empId
    }];
    this.pmsApiService.fetch('sso/logout', param, "post").subscribe(result => {
      if (result.code == "00") {
        //alert("UPDATE완료");
      } else {
        //alert("등록오류");
      }
    })

  }
}
