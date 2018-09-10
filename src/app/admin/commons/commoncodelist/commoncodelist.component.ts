import { Component, OnInit,ViewChild } from '@angular/core';
import { JsonApiService } from "../../../core/api/json-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NotificationService } from "../../../shared/utils/notification.service";
import { ModalDirective } from "ngx-bootstrap"; //모달

import { PmsApiService } from "../../../core/api/pms-api.service";
import { MlangService} from "../../../shared/mlang/mlang.service";

export class SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'app-commoncodelist',
  templateUrl: './commoncodelist.component.html',
  styleUrls: ['./commoncodelist.component.css']
})
export class CommoncodelistComponent implements OnInit {

  public main_code: String = "";
  public main_nm: String = "";

  public data_tree: any[];
  public tree_id: String = "";
  public expandedKeys: any[] = ['0'];
  public selectedKeys: any[] = [];

  public select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  public selectbox_list = [];    //그룹배열을 담아놓음
  public sc_group: string; //셀렉트박스 선언
  public sc_gubun: string; //셀렉트박스 선언

  public idx : string = ""; //key
  public gubun : string = ""; //N = 추가, A = 하위추가, E = 수정

  public View_Subject : string = ""; //뷰 제목

  View_page : boolean = true; //상세조회창 트리선택 에 따라서 보이고 안보이고
  Reg_edit_button : boolean = false; //기본수정
  Sub_reg_button : boolean = false;  //트리추가
  Sub_add_button : boolean = true;   //하위트리추가

  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private mlangService: MlangService
  )
  {
    //그룹, 검색 초기값 셋팅
    this.sc_group = "all";

    this.Bind_Group_Data();
  }

  ngOnInit() {

  }


  //셀렉트 박스 그룹 시작
  //1. 셀렉트 박스에 넣을 DB조회하여  ID, VALUE 가져오기
  //메인코드 바인드 부분!!!
  public Bind_Group_Data(): void {
    this.select_bind_dt = [];
    this.selectbox_list = [];

    //alert(this.sc_group)
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", group_id : this.sc_group}];
    this.pmsApiService.fetch('commoncodelist/common_bind', param).subscribe(result => {
      this.select_bind_dt = result.data;
      this.Group_Bind();
    })

  }
  //2. 셀렉트 박스에 ID, VALUE 삽입하기
  private Group_Bind(): void {
    //바인드
    for (let i = 0; i < this.select_bind_dt.length; i++) {
      //alert(this.select_bind_dt[i].id+"||"+this.select_bind_dt[i].nm));
      this.selectbox_list.push(new SelectBox(this.select_bind_dt[i].id, this.select_bind_dt[i].nm));

      if( i == 0) {
        this.main_code = this.select_bind_dt[i].id;
        this.main_nm = this.select_bind_dt[i].nm;

        this.sc_gubun = this.select_bind_dt[i].id;

        this.fetch_tree();
      }
    }

  }
  //셀렉트 박스 그룹 끝

  private Search_tree(event: any) {
    //console.log(event.target[event.target.selectedIndex].label)
    //console.log(event.target.value)
    this.main_code = event.target.value;
    this.main_nm = event.target[event.target.selectedIndex].label;

    this.fetch_tree();
  }


//하위코드 트리 시작
  private fetch_tree() {
    this.View_page = true;       //상세조회창
    this.gubun = "";  //전체초기화
    this.tree_id = "";//트리 선택된값 지우기
    this.selectedKeys = [];

    //alert("main_code=" + this.main_code + "--TREE하위정보조회--");
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA", main_code : this.sc_gubun}];
    this.pmsApiService.fetch('commoncodelist/common_tree', param).subscribe(result => {
      if (result.code == "00") {
        this.data_tree = JSON.parse(result.data);
      } else {
        alert("오류 리스트_main");
      }
    })
  }

  public treeSelection(event: any): void {
    this.tree_id = event.dataItem.id;    //us
    this.idx = this.sc_gubun;  //AD00001

    this.gubun = "E"; //수정

    //console.log(event.dataItem)

    if(event.dataItem.parentid == "")
    {
      //parentid 없다면 최상위를 클릭하였을때는 안보임
      this.View_page = true;       //상세조회창
      this.Reg_edit_button = false; //메인코드 수정
      this.Sub_reg_button = false; //추가버튼
      this.Sub_add_button = true; //하위추가버튼
    }
    else{
      this.View_Subject = "상세조회";
      this.View_page = false;       //상세조회창
      this.Reg_edit_button = true; //메인코드 수정
      this.Sub_reg_button = true; //추가버튼
      this.Sub_add_button = false; //하위추가버튼
    }
  }

  //모달창 선언
  @ViewChild('myModal_Main_reg') public myModal_Main_reg:ModalDirective;
  //메인코드 수정 모달
  private Edit_Show_Main_Modal():void {
    this.idx = this.sc_gubun;
    this.myModal_Main_reg.show();
  }

  //메인코드 모달
  private Show_Main_Modal():void {
    this.idx = "";
    this.myModal_Main_reg.show();
  }

  private Refresh_HideModal_Reg():void {
    this.myModal_Main_reg.hide();
    this.Bind_Group_Data();
  }

  //서브코드 (뷰창)저장후 트리 리로드
  private Refresh_Sub_tree():void {
    this.fetch_tree();
  }

  //새로운 코드 추가 (뷰창 )
  private New_Sub_Code():void {
    this.idx = this.sc_gubun;
    this.gubun = "N"; //추가
    this.View_page = false;       //상세조회창
    this.View_Subject = "코드 신규";
  }

  //서브코드 모달 하위추가
  private Add_Sub_Code():void {

    if (this.tree_id == undefined || this.tree_id == "") {
      this.call_massage();
    }
    else{
      this.gubun = "A"; //하위추가
      this.View_Subject = "하위 코드 신규";
    }

  }

  private call_massage():void {
    this.notificationService.smallBox({
      title: this.mlangService.getTranslation('하위코드를 선택하세요.', 'MSG', 'M000017', '38'),
      content: "필수선택입니다.",
      color: "#C46A69",
      iconSmall: "fa fa-check fa-2x fadeInRight animated",
      timeout: 2000
    });
    return;
  }

}
