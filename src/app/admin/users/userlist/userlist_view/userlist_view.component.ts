import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { JsonApiService } from "../../../../core/api/json-api.service";
import {NotificationService} from "../../../../shared/utils/notification.service";
import { PmsApiService } from "../../../../core/api/pms-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { pmsConfig } from '../../../../shared/pms.config';

import { MlangService} from "../../../../shared/mlang/mlang.service";

@Component({
  selector: 'app-userlist-view',
  templateUrl: './userlist_view.component.html',
})
export class Userlist_viewComponent implements OnInit {

  @Input() idx: string;
  @Output() close_hide_view = new EventEmitter(); //수정 버튼 클릭시 뷰창 닫고 등록창 오픈
  @Output() close_showEvent = new EventEmitter(); //닫기버튼 클릭시 뷰창 닫음
  @Output() close_refresh_view = new EventEmitter(); //삭제시 뷰창닫고 그리드 리로드
  HideModal_View(){
    this.close_hide_view.emit('this is a test');
  }
  opener_ShowRegModal(){
    this.close_showEvent.emit('this is a test');
  }
  opener_close_refresh(){
    this.close_refresh_view.emit('this is a test');
  }

  private gridData_Sub: any[];
  private gridView_Sub: GridDataResult;
  private gridSort_Sub: SortDescriptor[] = [];
  //private gridSelection_Sub: any[] = [];
  private inputcolor : string;
  private EMP_PROFILE_IMG : string;
  private EMP_NO : string;
  private EMAIL_ADDR : string;
  private UserName : string;
  private PHONE : string;
  private EMP_STTS_NM : string;
  private DeptName : string;
  private JOB_NM_T : string;
  private JOB_NM_R : string;

  private JOB_NM_P : string;
  private JOB_NM_D : string;
  private JOB_NM_O : string;
  private COMPANY_PHONE : string;
  private LIST_COUNT : string;
  private PMS_USE_YN_NM : string;

  private PROGRESS_CD : any;

  T : boolean = false; //직책
  R : boolean = false; //직급
  P : boolean = false; //직위
  D : boolean = false; //직무
  O : boolean = false; //직군

  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private mlangService: MlangService
  ){

  }

  ngOnChanges  () {

    for (let obj of pmsConfig.User_joblist) {
              for (let key in obj) {
                  //console.log("key : " + key + ",  value : ", obj[key]);
                  let isView : boolean = false;
                  if (obj[key] == "Y") isView = false;
                  else isView = true;
                  this[key] = isView;
          }
    }

    this.EMP_PROFILE_IMG = "";
    this.EMP_NO = "";
    this.EMAIL_ADDR = "";
    this.UserName = "";
    this.PHONE = "";
    this.EMP_STTS_NM = "";
    this.DeptName = "";
    this.JOB_NM_T = "";
    this.JOB_NM_R = "";
    this.JOB_NM_P = "";
    this.JOB_NM_D = "";
    this.JOB_NM_O = "";
    this.COMPANY_PHONE = "";
    this.LIST_COUNT = "";
    this.PMS_USE_YN_NM = "";
    this.PROGRESS_CD = "";

    this.Data_View();
    this.SearchGrid_Sub();
    this.inputcolor = "#eee";
  }

  ngOnInit() {

  }

  private ViewDelete() {
    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        let param = "/" + this.idx + "/COLLABRA";
        this.pmsApiService.fetch('userlist/user', param, "delete").subscribe(result => {
          if (result.code == "00") {
              this.opener_close_refresh(); //모달 닫기 및 그리드 리로드
          } else {
            alert("삭제오류");
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });
  }

  private Data_View() {
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , emp_no : this.idx}];
    this.pmsApiService.fetch('userlist/user_view', param).subscribe(result => {

      for (let obj of result.data) {
                for (let key in obj) {
                    //console.log("key : " + key + ",  value : ", obj[key]);
                    this[key] = obj[key];
                }
              }
      //담당공정 뷰 조회
      let work_cd = "";
      for (let obj of result.data_work) {
          if(work_cd != "") work_cd += ", ";
          work_cd += obj.WORK_NM;
      }
      this.PROGRESS_CD = work_cd;

    })
  }


  //-----------------------------------------------------------------------------
  //그리드
  //-----------------------------------------------------------------------------
  //메인코드 그리드 시작
  private sortChange_Sub(sort: SortDescriptor[]): void {
    this.gridSort_Sub = sort;
    this.loadGrid_Sub();
  }

  private loadGrid_Sub(): void {

    this.gridView_Sub = {
      data: orderBy(this.gridData_Sub, this.gridSort_Sub),
      total: this.gridData_Sub.length
    };

  }

  private SearchGrid_Sub(): void {
    //this.gridSelection_Sub = [];

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", emp_no : this.idx}];
    this.pmsApiService.fetch('userlist/user_sub_grid', param).subscribe(result => {
    //console.log(result.data)
      this.gridData_Sub = result.data;
      this.loadGrid_Sub();
    })

  }
  //메인코드 그리드 끝



}
