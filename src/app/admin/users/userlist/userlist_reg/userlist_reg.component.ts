import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationService} from "../../../../shared/utils/notification.service";
import { PmsApiService } from "../../../../core/api/pms-api.service";
import { UserService} from "../../../../shared/user/user.service";
import { ModalDirective} from "ngx-bootstrap";
import { pmsConfig } from '../../../../shared/pms.config';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query'; //그리드
import { GridDataResult } from '@progress/kendo-angular-grid';//그리드

import { MlangService} from "../../../../shared/mlang/mlang.service";

export class Job_SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'app-userlist-reg',
  templateUrl: './userlist_reg.component.html',
})

//export class Userlist_regComponent implements OnInit {
export class Userlist_regComponent implements OnInit {
  @Input() idx: string;
  is_edit : boolean = false;
  @Output() close_hide_reg = new EventEmitter(); //화면의 닫기버튼 호출용
  @Output() close_refresh_reg = new EventEmitter(); //등록창 닫기
  HideModal_Reg(){
    this.close_hide_reg.emit('this is a test');
  }
  opener_refresh_call(){
    this.close_refresh_reg.emit('test');
  }

  private JOB_idx_dept : string;

  //팝업전용 시작
  private Arr_Cd_Nm: {};
  private Use_YN : string;
  private Pop_dept_cd : string;
  private Expanded_YN : string;
  //팝업전용 끝

  private gridData_Sub: any[];
  private gridView_Sub: GridDataResult;
  private gridSort_Sub: SortDescriptor[] = [];
  private gridSelection_Sub: any[] = [];

  user:any;
  private inputcolor : string;
  private EMP_NO : string;
  private EMAIL_ADDR : string;
  private EMP_PWD : string;
  private EMP_PWD_CF : string;
  private UserName : string;
  private PHONE : string;
  private EMP_STTS : string;
  private DeptName : string;
  private Dept_CD : string;
  private Dept_CD_Before : string;
  private JOB_CD_T : string;
  private JOB_CD_R : string;
  private JOB_CD_P : string;
  private JOB_CD_D : string;
  private JOB_CD_O : string;
  private COMPANY_PHONE : string;
  private LIST_COUNT : string;
  private PMS_USE_YN : string;
  private T_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private T_selectbox_list = [];    //그룹배열을 담아놓음
  private R_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private R_selectbox_list = [];    //그룹배열을 담아놓음
  private P_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private P_selectbox_list = [];    //그룹배열을 담아놓음
  private D_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private D_selectbox_list = [];    //그룹배열을 담아놓음
  private O_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private O_selectbox_list = [];    //그룹배열을 담아놓음

  private progress_cd_list: Array<any>; //공정
  private job_cd_list: Array<any>; //직책(공통코드)
  JOB_CD_T_NEW;
  private PROGRESS_CD : any;

  //SUB_Job_Reg
  private Sub_JOB_STTS : string;
  private Sub_DeptName : string;
  private Sub_Dept_CD : string;
  private Sub_Dept_CD_Before : string;
  private Sub_JOB_CD_T : string;
  private Sub_JOB_CD_R : string;
  private Sub_JOB_CD_P : string;
  private Sub_JOB_CD_D : string;
  private Sub_JOB_CD_O : string;

  T : boolean = false; //직책
  R : boolean = false; //직급
  P : boolean = false; //직위
  D : boolean = false; //직무
  O : boolean = false; //직군
  FirstHidden : boolean = false; //IDX 없는 등록의 경우 겸직그리드와 추가버튼 비노출
  PopDeletetHidden : boolean = false; //IDX 없는 등록의 경우 겸직그리드와 추가버튼 비노출

  constructor(
    private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private userService: UserService
    , private mlangService: MlangService

  ){
      this.JOB_idx_dept = ""; //초기값 공백 기정 undefined 방지
      this.user = this.userService.getLoginInfo()
  }

  ngOnChanges() {

    //alert(pmsConfig.User_joblist[0]["P"])
    //console.log(pmsConfig.User_joblist[0])
    for (let obj of pmsConfig.User_joblist) {
              for (let key in obj) {
                  //console.log("key : " + key + ",  value : ", obj[key]);
                  let isView : boolean = false;
                  if (obj[key] == "Y") isView = false;
                  else isView = true;
                  this[key] = isView;
          }
    }

    if(this.idx == ""){
      //최초등록일 경우 겸직추가 버튼과 그리드 숨김
      this.FirstHidden = true;
      this.inputcolor = "";

      this.is_edit=false;
      this.EMP_NO = "";
      this.EMAIL_ADDR = "";
      this.EMP_PWD = "";
      this.EMP_PWD_CF = "";
      this.UserName = "";
      this.PHONE = "";
      this.EMP_STTS = "I";
      this.Dept_CD = "";
      this.DeptName = "";
      this.COMPANY_PHONE = "";
      this.LIST_COUNT = "30";
      this.PMS_USE_YN = "Y";

      this.Job_Select_Bind("T");
      this.Job_Select_Bind("R");
      this.Job_Select_Bind("P");
      this.Job_Select_Bind("D");
      this.Job_Select_Bind("O");

      this.JOB_CD_T = "18";
      this.JOB_CD_R = "1";
      this.JOB_CD_P = "";
      this.JOB_CD_D = "";
      this.JOB_CD_O = "";
    }
    else{
      this.FirstHidden = false;
      this.is_edit=true;
      this.inputcolor = "#eee";
      this.Data_Load();
      this.SearchGrid_Sub();
    }

  }

  private isDisabled() : boolean{
    return this.is_edit;
  }

  private Data_Load() {
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , emp_no : this.idx}];
    this.pmsApiService.fetch('userlist/user_view', param).subscribe(result => {

      for (let obj of result.data) {
                for (let key in obj) {
                    //console.log("key : " + key + ",  value : ", obj[key]);
                    this[key] = obj[key];
                }
            }

        //담당공정 선택조회
        let productList: any[] = [];
        for (let obj of result.data_work) {
            productList.push(obj.WORK_CD);
        }
        this.PROGRESS_CD = productList;

    })

    // this.image = "assets/img/superbox/superbox-full-7.jpg";
  }

  ngOnInit() {
    //공정리스트
    let param = [{
      main_cd: "BS00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.progress_cd_list = result.data;
    });

    //직책
    param = [{
      main_cd: "BS00008"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.job_cd_list = result.data;
      this.JOB_CD_T_NEW = result.data[0].SUB_CD;
    });

  }

  //셀렉트 박스 그룹 시작
  //1. 셀렉트 박스에 넣을 DB조회하여  ID, VALUE 가져오기
  public Job_Select_Bind(gubun): void {

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", type_gubun: gubun}];
    this.pmsApiService.fetch('userlist/user_bind', param).subscribe(result => {
        this[gubun + "_select_bind_dt"] = result.data;
        this.Job_box_bind(gubun);
    })
  }
  //2. 셀렉트 박스에 ID, VALUE 삽입하기
  private Job_box_bind(gubun): void {
    //바인드

      this[gubun + "_selectbox_list"] = [];
      for (let i = 0; i < this[gubun + "_select_bind_dt"].length; i++) {
        this[gubun + "_selectbox_list"].push(new Job_SelectBox(this[gubun + "_select_bind_dt"][i].id, this[gubun + "_select_bind_dt"][i].nm));
      }

  }
  //셀렉트 박스 그룹 끝

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

  private Regsave():void {

    if (this.save_Check("EMP_NO", this.mlangService.getTranslation('사용자ID', 'LABEL', 'L000010', '34')) == false) return;
    if (this.save_Check("EMAIL_ADDR", this.mlangService.getTranslation('Email', 'LABEL', 'L000018', '34')) == false) return;
    if (this.save_Check("UserName", this.mlangService.getTranslation('이름', 'LABEL', 'L000006', '34')) == false) return;
    if (this.save_Check("PHONE", this.mlangService.getTranslation('휴대폰번호', 'LABEL', 'L000019', '34')) == false) return;
    if (this.save_Check("Dept_CD", this.mlangService.getTranslation('부서', 'LABEL', 'L000001', '34')) == false) return;
    if (this.save_Check("JOB_CD_T", this.mlangService.getTranslation('직책', 'LABEL', 'L000011', '34')) == false) return;
    //if (this.save_Check("JOB_CD_R", this.mlangService.getTranslation('직급', 'LABEL', 'L000012', '34')) == false) return;

    //최초 등록일 경우만 비밀번호가 공백인지 체크
    if(this.idx == "" )
    {
        if (this.EMP_PWD == "") {
          if (this.save_Check("EMP_PWD", this.mlangService.getTranslation('비빌번호 확인', 'LABEL', 'L000028', '34')) == false) return;
        } else if (this.EMP_PWD_CF == "") {
          if (this.save_Check("EMP_PWD_CF", this.mlangService.getTranslation('비빌번호 확인', 'LABEL', 'L000028', '34')) == false) return;
        }
    }

    //비밀번호가 둘다 공백이 아닌경우 두개가 같은지 체크해야함.
    if(this.EMP_PWD != "" || this.EMP_PWD_CF != ""){
      if(this.EMP_PWD != this.EMP_PWD_CF){
        this.notificationService.smallBox({
          title: "비밀번호를 확인하세요.",
          content: this.mlangService.getTranslation('비밀번호는 같아야 합니다.', 'MSG', 'M000002', '34'),
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
      }
    }

    if(!this.user) this.user = this.userService.getLoginInfo()

    //신규 추가
    if(this.idx == ""){
      let param = [{
        company_cd: "COLLABRA"
        , lang_lcid: "1042"
        , emp_no: this.EMP_NO
        , email_addr: this.EMAIL_ADDR
        , emp_pwd: this.EMP_PWD
        , emp_pwd_cf: this.EMP_PWD_CF
        , username: this.UserName
        , phone: this.PHONE
        , emp_stts: this.EMP_STTS
        , dept_cd: this.Dept_CD
        , deptname: this.DeptName
        , job_cd_T: this.JOB_CD_T
        , job_cd_R: this.JOB_CD_R
        , job_cd_P: this.JOB_CD_P
        , job_cd_D: this.JOB_CD_D
        , job_cd_O: this.JOB_CD_O
        , company_phone: this.COMPANY_PHONE
        , list_count: this.LIST_COUNT
        , pms_use_yn: this.PMS_USE_YN
        , emp_profile_img: ""
        , reg_emp_no : this.user.empNo
        , progress_cd : this.PROGRESS_CD
        , job_cd : this.JOB_CD_T_NEW
      }];
      this.pmsApiService.fetch('userlist/user', param, "put").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh_call();
        } else {
          alert("등록오류");
        }
      })


    } else {
      //수정
      let param = [{
        company_cd: "COLLABRA"
        , lang_lcid: "1042"
        , emp_no: this.EMP_NO
        , email_addr: this.EMAIL_ADDR
        , emp_pwd: this.EMP_PWD
        , emp_pwd_cf: this.EMP_PWD_CF
        , username: this.UserName
        , phone: this.PHONE
        , emp_stts: this.EMP_STTS
        , dept_cd: this.Dept_CD
        , deptname: this.DeptName
        , job_cd_T: this.JOB_CD_T
        , job_cd_R: this.JOB_CD_R
        , job_cd_P: this.JOB_CD_P
        , job_cd_D: this.JOB_CD_D
        , job_cd_O: this.JOB_CD_O
        , company_phone: this.COMPANY_PHONE
        , list_count: this.LIST_COUNT
        , pms_use_yn: this.PMS_USE_YN
        , emp_profile_img: ""
        , reg_emp_no : this.user.empNo
        , dept_cd_before : this.Dept_CD_Before
        , progress_cd : this.PROGRESS_CD
        , job_cd : this.JOB_CD_T_NEW
      }];
      this.pmsApiService.fetch('userlist/user', param, "patch").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh_call();
        } else {
          alert("수정오류");
        }
      })

    }

  }

 //-----------------------------------------------------------------------------
 //서브 추가 팝업 등록
 //-----------------------------------------------------------------------------
  @ViewChild('lgModal_Job_reg') public lgModal_Job_reg:ModalDirective;

  private Sub_job_Save():void {
    if (this.save_Check("Sub_Dept_CD", this.mlangService.getTranslation('부서', 'LABEL', 'L000001', '34')) == false) return;
    if (this.save_Check("Sub_JOB_CD_T", this.mlangService.getTranslation('직책', 'LABEL', 'L000011', '34')) == false) return;
    if (this.save_Check("Sub_JOB_CD_R", this.mlangService.getTranslation('직급', 'LABEL', 'L000012', '34')) == false) return;

    if(!this.user) this.user = this.userService.getLoginInfo()

    //겸직 신규 추가
    if(this.JOB_idx_dept == ""){
      let param = [{
          emp_no: this.EMP_NO
        , sub_dept_cd: this.Sub_Dept_CD
        , sub_deptname: this.Sub_DeptName
        , sub_job_cd_T: this.Sub_JOB_CD_T
        , sub_job_cd_R: this.Sub_JOB_CD_R
        , sub_job_cd_P: this.Sub_JOB_CD_P
        , sub_job_cd_D: this.Sub_JOB_CD_D
        , sub_job_cd_O: this.Sub_JOB_CD_O
        , sub_job_stts: this.Sub_JOB_STTS
      }];
      this.pmsApiService.fetch('userlist/user_sub', param, "put").subscribe(result => {
        if (result.code == "00") {

          this.lgModal_Job_reg.hide();
          this.SearchGrid_Sub();

        } else {
          alert("등록오류");
        }
      })


    } else {
      //겸직 수정
      let param = [{
          emp_no: this.EMP_NO
        , sub_dept_cd: this.Sub_Dept_CD
        , sub_deptname: this.Sub_DeptName
        , sub_job_cd_T: this.Sub_JOB_CD_T
        , sub_job_cd_R: this.Sub_JOB_CD_R
        , sub_job_cd_P: this.Sub_JOB_CD_P
        , sub_job_cd_D: this.Sub_JOB_CD_D
        , sub_job_cd_O: this.Sub_JOB_CD_O
        , sub_job_stts: this.Sub_JOB_STTS
        , sub_dept_cd_before : this.Sub_Dept_CD_Before
      }];
      this.pmsApiService.fetch('userlist/user_sub', param, "patch").subscribe(result => {
        if (result.code == "00") {

          this.lgModal_Job_reg.hide();
          this.SearchGrid_Sub();

        } else {
          alert("수정오류");
        }
      })

    }

  }

  private Sub_job_Delete():void {
    let ret_tit = "";
    let ret_msg = "";
    ret_tit = this.mlangService.getTranslation('삭제하시겠습니까?', 'MSG', 'M000003', '34');
    ret_msg = "";
    this.notificationService.smartMessageBox({
      title: ret_tit,
      content:ret_msg,
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        // ret_tit = this.mlangService.getTranslation('삭제완료', 'MSG', 'M000005', '34');
        // ret_msg = this.mlangService.getTranslation('삭제되었습니다.', 'MSG', 'M000006', '34');
        //
        // this.notificationService.smallBox({
        //   title: ret_tit,
        //   content: ret_msg,
        //   color: "#C46A69",
        //   iconSmall: "fa fa-check fa-2x fadeInRight animated",
        //   timeout: 2000
        // });

        let param = "/" + this.EMP_NO + "/" + this.JOB_idx_dept + "/COLLABRA";
        this.pmsApiService.fetch('userlist/user_sub', param, "delete").subscribe(result => {
          if (result.code == "00") {

              this.lgModal_Job_reg.hide();
              this.SearchGrid_Sub();

          } else {
            alert("삭제오류");
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });
  }

  private Sub_Job_Add(): void {
      this.JOB_idx_dept = "";
      this.PopDeletetHidden = true;
      this.lgModal_Job_reg.show();

      this.Sub_JOB_STTS = "Y";
      this.Sub_DeptName = "";
      this.Sub_Dept_CD = "";
      this.Sub_JOB_CD_T = "";
      this.Sub_JOB_CD_R = "";
      this.Sub_JOB_CD_P = "";
      this.Sub_JOB_CD_D = "";
      this.Sub_JOB_CD_O = "";
  }

  private Sub_Job_View_Load() {
    this.PopDeletetHidden = false;
    this.lgModal_Job_reg.show();
    let param = [{ sub_dept_cd : this.JOB_idx_dept, emp_no : this.EMP_NO}];

    this.pmsApiService.fetch('userlist/user_sub_view', param).subscribe(result => {

      for (let obj of result.data) {
                for (let key in obj) {
                    //console.log("key : " + key + ",  value : ", obj[key]);
                    this[key] = obj[key];
                }
              }
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
    this.gridSelection_Sub = [];

    let param = [{emp_no : this.idx}];
    this.pmsApiService.fetch('userlist/user_sub_grid', param).subscribe(result => {
    //console.log(result.data)
      this.gridData_Sub = result.data;
      this.loadGrid_Sub();
    })

  }

  //그리드 선택시 하위트리 불러오기
  private OnClickEvent_Sub(event) {
    //this.mySelection 키로 해당 그리드 모든 정보 찾기
    // for (let i = 0; i < this.gridData_Sub.length; i++) {
    //   if (this.gridData_Sub[i].main_code == this.gridSelection_Sub) {
    //     break;
    //   }
    // }
    // this.JOB_idx_dept = this.gridSelection_Sub.toString();

    //if(event.columnIndex == "1")
    //{
      this.JOB_idx_dept = event.dataItem.Sub_Dept_CD;
      //조회창 열면서 조회
      this.Sub_Job_View_Load();
    //}

  }
  //메인코드 그리드 끝


  //모달창 선언
  @ViewChild('lgModal_pop_dept') public lgModal_pop_dept:ModalDirective;

  //메인코드 모달
  private Show_Pop_Dept_Modal(cd,nm):void {
     this.Pop_dept_cd = this.Dept_CD;
     this.Arr_Cd_Nm = {cd : cd, nm : nm};
     this.Use_YN = "Y";                     //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
     this.Expanded_YN ="Y";                 //트리 펼침 Y = 모두다
     this.lgModal_pop_dept.show();
  }

  private Close_Pop_Dept_Modal(arrdept):void {
     this[arrdept.cd] = arrdept.dept_id
     this[arrdept.nm] = arrdept.dept_nm

     this.lgModal_pop_dept.hide();
  }

}
