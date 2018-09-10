import { Component, OnInit, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import { JsonApiService } from "../../../../core/api/json-api.service";
import {NotificationService} from "../../../../shared/utils/notification.service";
import { PmsApiService } from "../../../../core/api/pms-api.service";
import { ModalDirective } from "ngx-bootstrap"; //모달
import { UserService} from "../../../../shared/user/user.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query'; //그리드
import { GridDataResult } from '@progress/kendo-angular-grid';//그리드
import { MlangService} from "../../../../shared/mlang/mlang.service";

@Component({
  selector: 'app-commoncodelist-sub-reg',
  templateUrl: './commoncodelist-sub-reg.component.html',
  styleUrls: ['./commoncodelist-sub-reg.component.css']
})
export class CommoncodelistSubRegComponent implements OnInit {
  @Input() idx: string;
  @Input() idx_nm: string;
  @Input() tree_id: string;
  @Input() gubun: string;//N = 추가, A = 하위추가, E = 수정

  @Output() opener_refresh_tree_sub = new EventEmitter(); //삭제시 뷰창닫고 그리드 리로드
  opener_refresh(){
    this.opener_refresh_tree_sub.emit('this is a test');
  }

  private gridData_Sub: any[];
  private gridView_Sub: GridDataResult;
  private gridSort_Sub: SortDescriptor[] = [];
  private gridSelection_Sub: any[] = [];

  user:any;
  public s_main_code: string;
  public s_main_code_nm: string;
  public s_sub_code: string;
  public s_sub_code_nm: string;
  public s_sub_reg_info: string;
  public s_sub_order: string;
  public s_parent_code: string;
  public s_sub_stts: string;
  public s_depth: number ;
  public isReadOnly: boolean;
  is_edit : boolean = false;
  First_Sub_Hidden : boolean = false; //IDX 없는 등록의 경우 겸직그리드와 추가버튼 비노출
  First_Cham_Hidden : boolean = false; //C_IDX 없는 등록의 경우 겸직그리드와 추가버튼 비노출

  public c_idx : string;
  public c_before_sub_code: string;
  public c_sub_code: string;
  public c_sub_code_nm: string;
  public c_sub_ord_no: string;
  public c_sub_stts: string;

  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private userService: UserService
    , private mlangService: MlangService
  ){
      this.c_idx = ""; //그리드 선택시 참조 코드 초기화
      this.user = this.userService.getLoginInfo()
  }

  ngOnChanges() {

    //alert(this.idx+"||"+this.tree_id+"||"+this.gubun)

    //그리드 초기화
    this.gridData_Sub = [];
    this.loadGrid_Sub();

    if(this.gubun == "")
    {
      this.First_Sub_Hidden = true;
      this.is_edit=false;
      this.s_main_code = "";
      this.s_main_code_nm = "";

      this.s_sub_code = "";
      this.s_sub_code_nm = "";
      this.s_sub_order = "";
      this.s_sub_reg_info = "";
      this.s_sub_stts ="Y";
    }
    else if(this.gubun == "N") //추가
    {
      this.First_Sub_Hidden = true;
      this.is_edit=false;
      this.s_main_code = this.idx;
      this.s_main_code_nm = this.idx_nm;

      this.s_sub_code = "";
      this.s_sub_code_nm = "";
      this.s_sub_order = "";
      this.s_sub_reg_info = "";
      this.s_sub_stts ="Y";
      this.gubun = "N";
    }
    else if(this.gubun == "A") //하위추가
    {
      this.First_Sub_Hidden = true;
      this.is_edit=false;
      this.s_main_code = this.idx;
      this.s_main_code_nm = this.idx_nm;

      this.s_sub_code = "";
      this.s_sub_code_nm = "";
      this.s_sub_order = "";
      this.s_sub_reg_info = "";
      this.s_sub_stts ="Y";
      this.gubun = "A";
    }
    else if(this.gubun == "E") //수정
    {
      this.First_Sub_Hidden = false;
      this.is_edit=true;
      this.Sub_Data_Load();

      this.SearchGrid_Sub(); //참조그리드
    }

  }

  ngOnInit() {
  }

  private isDisabled() : boolean{
    return this.is_edit;
  }

  private Sub_Data_Load() {
    //alert(this.idx+"||"+this.tree_id)
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , main_code : this.idx, sub_code : this.tree_id}];
    this.pmsApiService.fetch('commoncodelist/common_sub_view', param).subscribe(result => {

      for (let obj of result.data) {
                for (let key in obj) {
                    //console.log("key : " + key + ",  value : ", obj[key]);
                    //alert(obj[key])
                    this[key] = obj[key];
                }
              }
    })

  }


  private Reg_Sub_Delete():void {
    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {

        let param = [{
          s_main_code : this.idx
          ,s_sub_code: this.tree_id
        }];
        this.pmsApiService.fetch('commoncodelist/common_sub_delete', param, "put").subscribe(result => {
          if (result.code == "00") {
              this.opener_refresh();
          } else {
            alert(result.msg);
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });

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

  private Reg_Sub_Save():void {

    if (this.save_Check("s_sub_code_nm", this.mlangService.getTranslation('서브코드명', 'LABEL', 'L000101', '38')) == false) return;
    if (this.save_Check("s_sub_order", this.mlangService.getTranslation('순서', 'LABEL', 'L000102', '38')) == false) return;

    if(!this.user) this.user = this.userService.getLoginInfo()

    //신규 추가 , 자식 추가
    if(this.gubun == "N" || this.gubun == "A"){
      let param = [{
          s_main_code: this.s_main_code
        , s_main_code_nm: this.s_main_code_nm
        , s_sub_code: this.s_sub_code
        , s_sub_code_nm: this.s_sub_code_nm
        , s_sub_order: this.s_sub_order
        , s_sub_reg_info: this.s_sub_reg_info
        , s_sub_stts: this.s_sub_stts
        , s_gubun: this.gubun
        , s_tree_id: this.tree_id
        , reg_emp_no : this.user.empNo

        //, s_parent_code: this.s_parent_code
        //, s_depth: this.s_depth
      }];
      this.pmsApiService.fetch('commoncodelist/common_sub', param, "put").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh();
        } else {
          alert("등록오류");
        }
      })

    } else {

      //수정
      let param = [{
          s_main_code: this.s_main_code
        , s_main_code_nm: this.s_main_code_nm
        , s_sub_code: this.s_sub_code
        , s_sub_code_nm: this.s_sub_code_nm
        , s_sub_order: this.s_sub_order
        , s_sub_reg_info: this.s_sub_reg_info
        , s_sub_stts: this.s_sub_stts
        , reg_emp_no : this.user.empNo
      }];
      this.pmsApiService.fetch('commoncodelist/common_sub', param, "patch").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh();
        } else {
          alert("수정오류");
        }
      })

    }

  }




  //서브코드 등록창
  @ViewChild('myModal_subcode_reg') public myModal_subcode_reg:ModalDirective;
  private Add_Show_SubCode_Modal():void {
    this.c_idx = "";
    this.myModal_subcode_reg.show();
    this.c_sub_code = "";
    this.c_before_sub_code = "";
    this.c_sub_code_nm = "";
    this.c_sub_ord_no = "";
    this.c_sub_stts = "Y";
    this.First_Cham_Hidden = true;
  }

  private Hide_Show_SubCode_Modal():void {
    this.myModal_subcode_reg.hide();
  }

  private subcode_Save():void {

    if (this.save_Check("c_sub_code", this.mlangService.getTranslation('참조코드', 'LABEL', 'L000105', '38')) == false) return;
    if (this.save_Check("c_sub_code_nm", this.mlangService.getTranslation('참조코드명', 'LABEL', 'L000106', '38')) == false) return;
    if (this.save_Check("c_sub_ord_no", this.mlangService.getTranslation('순서', 'LABEL', 'L000102', '38')) == false) return;

    if(!this.user) this.user = this.userService.getLoginInfo()

    //겸직 신규 추가
    if(this.c_idx == ""){
      let param = [{
        company_cd: "COLLABRA"
        , lang_lcid: "1042"
        , s_main_code: this.s_main_code
        , s_sub_code: this.s_sub_code
        , c_sub_code: this.c_sub_code
        , c_sub_code_nm: this.c_sub_code_nm
        , c_sub_ord_no: this.c_sub_ord_no
        , c_sub_stts: this.c_sub_stts
        , reg_emp_no : this.user.empNo
      }];
      this.pmsApiService.fetch('commoncodelist/common_sub_cham', param, "put").subscribe(result => {
        if (result.code == "00") {

          this.myModal_subcode_reg.hide();
          this.SearchGrid_Sub();

        } else {
          alert("등록오류");
        }
      })


    } else {
      //겸직 수정
      let param = [{
        company_cd: "COLLABRA"
        , lang_lcid: "1042"
        , s_main_code: this.s_main_code
        , s_sub_code: this.s_sub_code
        , c_sub_code: this.c_sub_code
        , c_before_sub_code : this.c_before_sub_code
        , c_sub_code_nm: this.c_sub_code_nm
        , c_sub_ord_no: this.c_sub_ord_no
        , c_sub_stts: this.c_sub_stts
        , reg_emp_no : this.user.empNo
      }];

      this.pmsApiService.fetch('commoncodelist/common_sub_cham', param, "patch").subscribe(result => {
        if (result.code == "00") {

          this.myModal_subcode_reg.hide();
          this.SearchGrid_Sub();

        } else {
          alert("수정오류");
        }
      })

    }

  }

  private subcode_Delete():void {
    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {

        // let param = "/" + this.s_main_code + "/" + this.s_sub_code + "/" + this.c_idx + "/COLLABRA";
        // this.pmsApiService.fetch('commoncodelist/common_sub_cham', param, "delete").subscribe(result => {
        //   if (result.code == "00") {
        //
        //       this.myModal_subcode_reg.hide();
        //       this.SearchGrid_Sub();
        //
        //   } else {
        //     alert("삭제오류");
        //   }
        // })
        let param = [{
          s_main_code : this.s_main_code
          ,s_sub_code: this.s_sub_code
          ,c_sub_code: this.c_idx
        }];
        this.pmsApiService.fetch('commoncodelist/common_sub_cham_delete', param, "put").subscribe(result => {
          if (result.code == "00") {
                  this.myModal_subcode_reg.hide();
                  this.SearchGrid_Sub();
          } else {
            alert("오류 삭제");
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });
  }

  private subcode_Load() {

    this.myModal_subcode_reg.show();
    this.First_Cham_Hidden = false;

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , s_main_code: this.s_main_code
    , s_sub_code: this.s_sub_code
    , c_sub_code : this.c_idx}];
    this.pmsApiService.fetch('commoncodelist/common_sub_cham', param).subscribe(result => {

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

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", main_code : this.idx, sub_code : this.tree_id}];
    this.pmsApiService.fetch('commoncodelist/common_sub_cham_grid', param).subscribe(result => {
    //console.log(result.data)
      this.gridData_Sub = result.data;
      this.loadGrid_Sub();
    })

  }

  private OnClickEvent(event) {
    //this.mySelection 키로 해당 그리드 모든 정보 찾기
    // for (let i = 0; i < this.gridData_Sub.length; i++) {
    //   if (this.gridData_Sub[i].sub_code == this.gridSelection_Sub) {
    //     break;
    //   }
    // }
    //this.c_idx = this.gridSelection_Sub.toString();

    //if(event.columnIndex == "2")
    //{
      this.c_idx = event.dataItem.sub_code;
      //조회창 열면서 조회
      this.subcode_Load();
    //}

  }
  //메인코드 그리드 끝


}
