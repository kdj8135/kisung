import {Injectable, ApplicationRef} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {PmsApiService} from "../../core/api/pms-api.service";
import {UserService} from "../user/user.service";
import { pmsConfig } from '../../shared/pms.config';

@Injectable()
export class MlangService {
  user:any;

  public state;
  public data:any;
  public currentLanguageLcid:any;

  constructor(
    private pmsApiService:PmsApiService,
    private ref:ApplicationRef,
    private userService: UserService
  ) {
    this.state = new Subject();
    this.user = this.userService.getLoginInfo()
    this.currentLanguageLcid = this.user.langLcid ? this.user.langLcid : pmsConfig.defaultLocaleLcid
    this.fetch(this.currentLanguageLcid)
  }

  private fetch(langLcid: any) {
    this.pmsApiService.fetch('common/systemlanguage')
      .subscribe(result => {
        if (result.code == "00") {
          this.setLanguageObj(result.data)
          this.state.next(result.data);
          this.ref.tick()
        }
    })
  }

  private setLanguageObj(mObj: any){
    this.data = [];
    mObj.forEach(item => {
      this.data[item.LANG_KEY] = item.VALUE;
    });
  }

  subscribe(sub:any, err:any) {
    return this.state.subscribe(sub, err)
  }

  public getTranslation(value:string, LangGrpKey:string, LangKey:string, menuid:string):string {
    let reVal: string = value;
    if(this.data && this.data[LangGrpKey + "_" + LangKey + "_" + menuid])
    {
      reVal = this.data[LangGrpKey + "_" + LangKey + "_" + menuid]
    }
    else if(this.data && this.data[LangGrpKey + "_" + LangKey])
    {
      reVal = this.data[LangGrpKey + "_" + LangKey]
    }

    return reVal
  }

}
