import {Injectable} from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {

  public user: Subject<any>;

  public userInfo = {
    companyCd: 'companyCd'
    ,empNo: 'empNo'
    ,empId: 'empId'
    ,empNm: 'empNm'
    ,empStts: 'empStts'
    ,eMail: 'eMail'
    ,phone: 'phone'
    ,picture: 'picture'
    ,langLcid: 1042
    ,token: 'token'
    ,deptCd : 'deptCd'
    ,deptNm : 'deptNm'
  };

  constructor() {
    this.user = new Subject();
  }

  getLoginInfo() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

}
