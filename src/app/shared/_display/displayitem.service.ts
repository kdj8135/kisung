import {Injectable, ApplicationRef} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import {PmsApiService} from "../../core/api/pms-api.service";
import { UserService } from "../../shared/user/user.service";

@Injectable()
export class DisplayitemService {

  public state;
  public data:{};
  public currentMenuID;
  public currentMenuEventID;
  public user;
  constructor(private pmsApiService:PmsApiService, private ref:ApplicationRef,private userService: UserService) {
    this.user = userService.getLoginInfo();
    this.state = new Subject();
    this.initDisplayItem();
    //this.fetch(this.currentLanguage.key)
  }

  private fetch(locale: any) {

  }

  public initDisplayItem() {
    //console.log("initLanguage");

    let param = [{emp_no: this.user.empId}];
    this.pmsApiService.fetch('common/item_display', param).subscribe(menuRes => {
      if (menuRes.code == "00") {
        this.currentMenuID = JSON.stringify(menuRes.data_menu);
        this.currentMenuEventID = JSON.stringify(menuRes.data_event);
      }
    })
  }

  public getDisplay(value:string, menuid:string):string {
    let reslut = "";
    try {
      //menuid가 존재하면 none
      if (JSON.parse(this.currentMenuID)[menuid]) {
        //존재할경우 이벤트에서 또 검색
        //존재할경우 보이기
        if (JSON.parse(this.currentMenuEventID)[menuid + "_" + value]) {
          reslut = "inline";
        } else {
          reslut = "none";
        }
        //menuid가 존재하지 않다면 설정을 안한것이므로 보이기
      } else {
        reslut = "inline";
      }
    }
    catch(e) {
      reslut = "inline";
    }
    //console.log("getTranslation");
    return reslut
  }

}
