import { Injectable } from '@angular/core';
import { Http, HttpModule, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { pmsConfig } from '../../shared/pms.config';
import {UserService} from "../../shared/user/user.service";

@Injectable()
export class PmsApiService {
  user:any;
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http, private userService: UserService) {
    this.user = this.userService.getLoginInfo()
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  fetch(url: string, param: any = [{}], req_method: string = "post"): Observable<any> {
    if(!this.user) this.user = this.userService.getLoginInfo()
    if (req_method == "delete") {
      return this.http
        .delete(this.getBaseUrl() + pmsConfig.PMS_API_URL + url + param, this.options)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      let paramKey = Object.getOwnPropertyNames(param[0])
      if(this.user && paramKey.indexOf("company_cd") === -1) param[0]["company_cd"] = this.user.companyCd;
      if(this.user && paramKey.indexOf("lang_lcid") === -1) param[0]["lang_lcid"] = this.user.langLcid;

      let body = JSON.stringify(param);

      if (req_method == "put") {
        return this.http
          .put(this.getBaseUrl() + pmsConfig.PMS_API_URL + url, body, this.options)
          .map(this.extractData)
          .catch(this.handleError);
      } else if (req_method == "patch") {
        return this.http
          .patch(this.getBaseUrl() + pmsConfig.PMS_API_URL + url, body, this.options)
          .map(this.extractData)
          .catch(this.handleError);
      } else {
        return this.http
          .post(this.getBaseUrl() + pmsConfig.PMS_API_URL + url, body, this.options)
          .map(this.extractData)
          .catch(this.handleError);
      }
    }
  }

  private getBaseUrl() {
    return pmsConfig.Protocol + '://' + pmsConfig.Hostname + (pmsConfig.Port ? ':' + pmsConfig.Port : '') + '/'
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
