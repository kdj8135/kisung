import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JsonApiService } from "../../../../core/api/json-api.service";
import {NotificationService} from "../../../../shared/utils/notification.service";
import { PmsApiService } from "../../../../core/api/pms-api.service";
import { MlangService} from "../../../../shared/mlang/mlang.service";

export class M_SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'app-commoncodelist-main-reg',
  templateUrl: './commoncodelist-main-reg.component.html',
  styleUrls: ['./commoncodelist-main-reg.component.css']
})
export class CommoncodelistMainRegComponent implements OnInit {
  @Input() idx: string;
  @Output() close_hide_reg = new EventEmitter(); //화면의 닫기버튼 호출용
  @Output() close_refresh_reg = new EventEmitter(); //등록창 닫기
  HideModal_Reg(){
    this.close_hide_reg.emit('test');
  }
  opener_refresh_call(){
    this.close_refresh_reg.emit('test');
  }
  public reg_sc_group: string; //셀렉트박스 선언
  public main_code: string;
  public main_code_nm: string;
  public reg_info: string;
  public main_order: string;

  public main_select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  public main_selectbox_list = [];    //그룹배열을 담아놓음
  is_edit : boolean = false;
  Reg_del_button : boolean = false;

  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private mlangService: MlangService
  ){

  }

  ngOnChanges() {

    //alert("키값||"+this.idx)
        if(this.idx == ""){
            //this.Main_Select_Group();
            this.is_edit=false;
            this.Reg_del_button=true;
            this.reg_sc_group = "BS";
            this.main_code = "";
            this.main_code_nm = "";
            this.reg_info = "";
            this.main_order = "";

        }
        else{
          //this.Main_Select_Group();
          this.is_edit=true;
          this.Reg_del_button=false;
          this.Data_Load();
        }

  }

  ngOnInit() {
  }

  private isDisabled() : boolean{
    return this.is_edit;
  }
  //셀렉트 박스 그룹 시작
  //1. 셀렉트 박스에 넣을 DB조회하여  ID, VALUE 가져오기
    public Main_Select_Group(): void {

      let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"}];
      this.pmsApiService.fetch('commoncodelist/common_bind', param).subscribe(result => {
        this.main_select_bind_dt = result.data;
        this.Main_group_bind();
      })

    }
  //2. 셀렉트 박스에 ID, VALUE 삽입하기
    private Main_group_bind(): void {
      //바인드
      this.main_selectbox_list = [];
      for (let i = 0; i < this.main_select_bind_dt.length; i++) {
        this.main_selectbox_list.push(new M_SelectBox(this.main_select_bind_dt[i].id, this.main_select_bind_dt[i].nm));
      }
    }
  //셀렉트 박스 그룹 끝

  private Data_Load() {
      let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
      , main_code : this.idx}];
      this.pmsApiService.fetch('commoncodelist/common_reg_view', param).subscribe(result => {

        for (let obj of result.data) {
                  for (let key in obj) {
                      //console.log("key : " + key + ",  value : ", obj[key]);
                      this[key] = obj[key];
                  }
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

  private Reg_Main_Save():void {

    if (this.save_Check("main_code_nm", this.mlangService.getTranslation('메인코드명', 'LABEL', 'L000099', '38')) == false) return;
    if (this.save_Check("main_order", this.mlangService.getTranslation('순서', 'LABEL', 'L000102', '38')) == false) return;

    //신규 추가
    if(this.idx == ""){
      let param = [{
        company_cd: "COLLABRA"
        , lang_lcid: "1042"
        , common_group: this.reg_sc_group
        , common_nm: this.main_code_nm
        , common_order: this.main_order
        , common_info: this.reg_info
      }];
      this.pmsApiService.fetch('commoncodelist/common', param, "put").subscribe(result => {
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
        , common_idx: this.main_code
        , common_nm: this.main_code_nm
        , common_order: this.main_order
        , common_info: this.reg_info
      }];
      this.pmsApiService.fetch('commoncodelist/common', param, "patch").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh_call();
        } else {
          alert("수정오류");
        }
      })

    }

  }

  private Reg_Main_Del():void {
    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {

        let param = "/" + this.main_code + "/COLLABRA";
        this.pmsApiService.fetch('commoncodelist/common', param, "delete").subscribe(result => {
          if (result.code == "00") {
              this.opener_refresh_call();
          } else {
            alert("삭제오류");
          }
        })

      }
      if (ButtonPressed === "취소") {

      }


    });
  }

}
