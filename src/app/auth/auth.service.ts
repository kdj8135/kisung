import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import {PmsApiService} from "../core/api/pms-api.service";

@Injectable()
export class AuthService {

  constructor(private pmsApiService:PmsApiService) { }

  login(companycd: string, username: string, password: string, lang_lcid: string, auto_login: string) {

    return this.pmsApiService.fetch('sso/login',
      [{ company_cd: companycd, emp_no: username, emp_pwd: password
      , lang_lcid: lang_lcid, auto_login:auto_login }])
      .map(data => {
        if (data && data.result && data.result[0] && data.token) {
          data.result[0].token = data.token;
          localStorage.setItem('currentUser', JSON.stringify(data.result[0]));
          localStorage.setItem('currentProject', JSON.stringify(data.result_pjt));
        }

        return data;
      });
  }

  logout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentProject');
  }

}
