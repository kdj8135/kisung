import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../auth.service";

import { NotificationService } from "../../shared/utils/notification.service";
import { pmsConfig } from '../../shared/pms.config';



import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public companycd: string = 'COLLABRA'
  public currentLanguageLcid: '1042';
  public userid:string = '';
  public password:string = '';

  public page_tp:string = '';
  public router_url:string = '';
  public auto_login:string = 'N';
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService

    ,private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentProject');

    this.currentLanguageLcid = pmsConfig.defaultLocaleLcid ? pmsConfig.defaultLocaleLcid :1042;

    // //파라미터가 존재할때 자동로그인을 시켜준다.
     this.activatedRoute.paramMap.subscribe(params => {
        if (params.get('emp_no') != null) {
          this.auto_login = "Y";
          this.userid = params.get('emp_no');
          this.page_tp = params.get('page_tp');

          if (params.get('page_tp') == "product_my_work_list") {
            this.page_tp = "Y";
            this.router_url = '/molde/product_work/product_my_work_list';
          } else {
            this.page_tp = "N";
            this.router_url = '';
          }
          this.login("");
        }
      })

  }

  setLanguage($event){
    this.currentLanguageLcid = $event.language.lcid;
  }

  login(event){
    if (this.auto_login != "Y") event.preventDefault();
    this.authService.login(this.companycd, this.userid, this.password, this.currentLanguageLcid, this.auto_login).subscribe(
      data => {
        var fMassge:string = ''

        if(data.login == "success")
        {
          if (this.page_tp == "Y") {
            this.router.navigate([this.router_url]);
          } else if (this.page_tp == "N") {
            this.router.navigate(['/auth/login']);
          } else {
            this.router.navigate(['home']);
          }

          return;
        }
        else if(data.login == "fail-user-role")
        {
            fMassge = "로그인을 실패하였습니다.";
            this.router.navigate(['/auth/login']);
        }
        else if(data.login == "fail-user-emp")
        {
            fMassge = "아이디를 찾을수 없습니다.";
        }
        else if(data.login == "fail-user-pwd")
        {
            fMassge = "비밀번호가 일치하지 않습니다.";
        }

        this.notificationService.smallBox({
          title: "Notification",
          content: "<i class='fa fa-clock-o'></i> <i>"+ fMassge +"</i>",
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
      }

    );
  }

}
