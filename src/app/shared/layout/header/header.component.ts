import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { pmsConfig } from '../../../shared/pms.config';

declare var $: any;

import { ModalDirective } from "ngx-bootstrap";
import { NotificationService } from "../../../shared/utils/notification.service";

export class Job_SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router
    , private pmsApiService: PmsApiService
    , private userService: UserService
    , private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }

  userInfo;
  ngOnInit() {
    this.userInfo = this.user.deptNm + "/" + this.user.empNm;

    this.Job_Select_Bind("T");
    // this.Job_Select_Bind("R");
    // this.Job_Select_Bind("P");
    // this.Job_Select_Bind("D");
    // this.Job_Select_Bind("O");
    for (let obj of pmsConfig.User_joblist) {
      for (let key in obj) {
        //console.log("key : " + key + ",  value : ", obj[key]);
        let isView: boolean = false;
        if (obj[key] == "Y") isView = false;
        else isView = true;
        this[key] = isView;
      }
    }

  }

  user: any;
  searchMobileActive = false;

  toggleSearchMobile() {
    this.searchMobileActive = !this.searchMobileActive;
    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    //this.router.navigate(['/miscellaneous/search']);
  }

  private LogOut(): void {

    let param = [{
      emp_no: this.user.empId
    }];
    this.pmsApiService.fetch('sso/logout', param, "post").subscribe(result => {
      if (result.code == "00") {
        //alert("UPDATE완료");
      }
    })
  }

  private EMP_NO: string;
  private EMAIL_ADDR: string;
  private EMP_PWD: string;
  private EMP_PWD_CF: string;

  private UserName: string;
  private PHONE: string;
  private DeptName: string;
  private Dept_CD: string;
  private Dept_CD_Before: string;

  private JOB_CD_T: string;
  private JOB_CD_R: string;
  private JOB_CD_P: string;
  private JOB_CD_D: string;
  private JOB_CD_O: string;
  private COMPANY_PHONE: string;

  private T_select_bind_dt: any[]; //그룹 바인드할 DB를 담음
  private T_selectbox_list = [];    //그룹배열을 담아놓음
  private R_select_bind_dt: any[]; //그룹 바인드할 DB를 담음
  private R_selectbox_list = [];    //그룹배열을 담아놓음
  private P_select_bind_dt: any[]; //그룹 바인드할 DB를 담음
  private P_selectbox_list = [];    //그룹배열을 담아놓음
  private D_select_bind_dt: any[]; //그룹 바인드할 DB를 담음
  private D_selectbox_list = [];    //그룹배열을 담아놓음
  private O_select_bind_dt: any[]; //그룹 바인드할 DB를 담음
  private O_selectbox_list = [];    //그룹배열을 담아놓음
  T: boolean = false; //직책
  R: boolean = false; //직급
  P: boolean = false; //직위
  D: boolean = false; //직무
  O: boolean = false; //직군


  public Job_Select_Bind(gubun): void {
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", type_gubun: gubun }];
    this.pmsApiService.fetch('userlist/user_bind', param).subscribe(result => {
      this[gubun + "_select_bind_dt"] = result.data;
      this.Job_box_bind(gubun);
    })
  }

  private Job_box_bind(gubun): void {
    this[gubun + "_selectbox_list"] = [];
    for (let i = 0; i < this[gubun + "_select_bind_dt"].length; i++) {
      this[gubun + "_selectbox_list"].push(new Job_SelectBox(this[gubun + "_select_bind_dt"][i].id, this[gubun + "_select_bind_dt"][i].nm));
    }

  }

  @ViewChild('lgModal_profile') public lgModal_profile: ModalDirective;
  open_profile() {
    this.lgModal_profile.show();
    this.search_profile();
  }

  private search_profile() {
    let param = [{
      lang_lcid: "1042", company_cd: "COLLABRA"
      , emp_no: this.user.empId
    }];
    this.pmsApiService.fetch('userlist/user_view', param).subscribe(result => {

      for (let obj of result.data) {
        for (let key in obj) {
          //console.log("key : " + key + ",  value : ", obj[key]);
          this[key] = obj[key];
        }
      }
    })
  }

  savedata_profile() {
    if (this.save_Check("EMP_NO", '사용자ID') == false) return;
    if (this.save_Check("EMAIL_ADDR", 'Email') == false) return;
    if (this.save_Check("UserName", '이름') == false) return;
    if (this.save_Check("PHONE", '휴대폰번호') == false) return;
    if (this.save_Check("Dept_CD", '부서') == false) return;
    if (this.save_Check("JOB_CD_T", '직책') == false) return;


    //비밀번호가 둘다 공백이 아닌경우 두개가 같은지 체크해야함.
    if (this.EMP_PWD != "" || this.EMP_PWD_CF != "") {
      if (this.EMP_PWD != this.EMP_PWD_CF) {
        this.notificationService.smallBox({
          title: "비밀번호를 확인하세요.",
          content: '비밀번호는 같아야 합니다.',
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
      }
    }

    if (!this.user) this.user = this.userService.getLoginInfo()


    //수정
    let param = [{
      company_cd: "COLLABRA"
      , lang_lcid: "1042"
      , emp_no: (this.EMP_NO || "")
      , email_addr: (this.EMAIL_ADDR || "")
      , emp_pwd: (this.EMP_PWD || "")
      , emp_pwd_cf: (this.EMP_PWD_CF || "")
      , username: (this.UserName || "")
      , phone: (this.PHONE || "")
      , dept_cd: (this.Dept_CD || "")
      , deptname: (this.DeptName || "")
      , job_cd_T: (this.JOB_CD_T || "")
      , company_phone: (this.COMPANY_PHONE || "")
      , dept_cd_before: (this.Dept_CD_Before || "")
    }];
    this.pmsApiService.fetch('userlist/user_top', param, "patch").subscribe(result => {
      if (result.code == "00") {
        this.user.deptCd = (this.Dept_CD || "");
        this.user.deptNm = (this.DeptName || "");
        this.user.eMail = (this.EMAIL_ADDR || "");
        this.user.empNm = (this.UserName || "");
        this.user.phone = (this.PHONE || "");
        this.userInfo = this.user.deptNm + "/" + this.user.empNm;
        localStorage.removeItem('currentUser');
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.lgModal_profile.hide();
      } else {
        alert("수정오류");
      }
    })

  }

  save_Check(key, text): Boolean {
    let ret = true;
    if (this[key] == undefined || this[key] == "") {
      this.notificationService.smallBox({
        title: text + "을(를) 입력하세요.",
        content: "필수입력입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false;
    }
    return ret;
  }

  @ViewChild('lgModal_pop_dept') public lgModal_pop_dept: ModalDirective;

  //부서모달
  private Arr_Cd_Nm: {};
  private Use_YN: string;
  private Pop_dept_cd: string;
  private Expanded_YN: string;

  private Show_Pop_Dept_Modal(cd, nm): void {
    this.Pop_dept_cd = this.Dept_CD;
    this.Arr_Cd_Nm = { cd: cd, nm: nm };
    this.Use_YN = "Y";                     //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
    this.Expanded_YN = "Y";                 //트리 펼침 Y = 모두다
    this.lgModal_pop_dept.show();
  }

  private Close_Pop_Dept_Modal(arrdept): void {
    this[arrdept.cd] = arrdept.dept_id
    this[arrdept.nm] = arrdept.dept_nm
    this.lgModal_pop_dept.hide();
  }

}
