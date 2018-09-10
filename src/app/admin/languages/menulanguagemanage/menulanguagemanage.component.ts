import { Component, OnInit } from '@angular/core';

import { PmsApiService } from "../../../core/api/pms-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings,DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { NotificationService } from "../../../shared/utils/notification.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
//import { LanguagemanageComponent } from '../languagemanage/languagemanage.component';

export class SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'app-menulanguagemanage',
  templateUrl: './menulanguagemanage.component.html',
  styleUrls: ['./menulanguagemanage.component.css']
})
export class MenulanguagemanageComponent implements OnInit {

  constructor(
    private pmsApiService: PmsApiService
    , private notificationService: NotificationService
  ) {

    //트리
    this.serachTree_Dept_expanded();
    this.serachTree_Dept();

    //시스템다국어
    this.Bind_Languagemanage_Data("sel_langlcid");
    this.Bind_Languagemanage_Data("sel_langgrpkey");
    this.searchGrid_language();
  }

  //---------tree
  private Use_YN: String = "Y"; //사용유무 조직도 Y,N
  private dept_tree: any[];
  private menu_id: String = "";
  private menu_nm: String = "";
  private menu_parentid: String = "";
  private menu_type: String = "";
  private expandedKeys: any[] = [];

  //---------grid 다국어
  private sel_langlcid_dt : any[];    //for문을 위하여 (그리드 언어)
  private sel_langgrpkey_dt : any[];    //for문을 위하여(그리드 다국어그룹키)
  private select_bind_dt : any[]; //그룹 바인드할 DB를 담음
  private selectbox_langlcid_list = [];    //그룹배열을 담아놓음
  private selectbox_langgrpkey_list = [];    //그룹배열을 담아놓음
  private sel_langlcid: string = "all"; //셀렉트박스 선언
  private sel_langgrpkey: string = "all"; //셀렉트박스 선언
  private txtlangkey: string = ""; //text박스 선언
  private txtvalue: string = ""; //text박스 선언

  private gridData_Lang: any[];
  private gridView_Lang: GridDataResult;
  private gridSort_Lang: SortDescriptor[] = [];
  private gridSelection_Lang: any[] = [];
  private pageSize: number = 15;
  private skip: number = 0;
  private sort: SortDescriptor[] = [];
  private sort_dir : string = "";
  private sort_field : string = "";

  //메뉴 다국어
  private gridData_MenuLang: any[];
  private gridView_MenuLang: GridDataResult;
  private gridSort_MenuLang: SortDescriptor[] = [];
  private gridSelection_MenuLang: any[] = [];
  private pageSize_MenuLang: number = 15;
  private skip_MenuLang: number = 0;
  private sort_MenuLang: SortDescriptor[] = [];
  private editedRowIndex_MenuLang: number;
  private formGroup_MenuLang: FormGroup;


  private LANG_M_COMPANY_CD: String = "";
  private LANG_M_LCID: String = "";
  private LANG_M_GRKEY: String = "";
  private LANG_M_KEY: String = "";

  ngOnInit() {
  }

  //트리전체 펼침 text 가져오기
  private serachTree_Dept_expanded() {

    //if (this.Use_YN == undefined) this.Use_YN = "Y";
    let param = [{
      use_yn: this.Use_YN
    }];
    this.pmsApiService.fetch('languagemanage/menulanguagemanage_TreeExpanded', param).subscribe(result => {
      if (result.code == "00") {

        //console.log(result.data);
        let arr_text = [];
        for (let obj of result.data) {
              arr_text.push(obj.text);
        }

        this.expandedKeys = arr_text;

      } else {
        alert("오류 리스트");
      }
    })

  }

  //트리조회
  private serachTree_Dept() {

    if (this.Use_YN == undefined) this.Use_YN = "Y";

    let param = [{
      use_yn: this.Use_YN
    }];
    this.pmsApiService.fetch('languagemanage/menulanguagemanage_Tree', param).subscribe(result => {
      if (result.code == "00") {

        this.dept_tree = JSON.parse(result.data);

      } else {
        alert("오류 리스트");
      }
    })
  }

  private treeSelection(event: any): void {

    if(event.dataItem.param1 == "P")
    {
      this.menu_nm = event.dataItem.text;
      this.menu_id = event.dataItem.id;
      this.menu_parentid = event.dataItem.parentid;
      this.menu_type = event.dataItem.param1;
    }
    else{
      this.menu_nm = "";
      this.menu_id = "";
      this.menu_parentid = "";
      this.menu_type = "";
    }

    this.searchGrid_language_menu();

  }

  public fetchChildren(node: any): Observable<any[]> {
      //return the parent node's items collection as children
      return of(node.items);
  }

  public hasChildren(node: any): boolean {
      //check if the parent node has children
      return node.items && node.items.length > 0;
  }






  //-------------------그리드 시스템 다국어------------------------------

  //메인코드 바인드 부분!!!
  public Bind_Languagemanage_Data(bind_gubun): void {
    this.select_bind_dt = [];
    this[bind_gubun + "_dt"] = [];

    let param = [{ bind_gubun : bind_gubun}];
    this.pmsApiService.fetch('languagemanage/languagemanage_bind', param).subscribe(result => {
      this.select_bind_dt = result.data;

      this[bind_gubun + "_dt"] = result.data;

      this.Languagemanage_Bind(bind_gubun);
    })

  }
  //2. 셀렉트 박스에 ID, VALUE 삽입하기
  public Languagemanage_Bind(bind_gubun): void {
    //바인드
    this["selectbox_" + bind_gubun + "_list"] = [];
    for (let i = 0; i < this.select_bind_dt.length; i++) {

      this["selectbox_" + bind_gubun + "_list"].push(new SelectBox(this.select_bind_dt[i].id, this.select_bind_dt[i].nm));

    }

    this[bind_gubun] = "all"; //전체로 바인드

  }
  //셀렉트 박스 그룹 끝




  //시스템다국어 ------------------------------------start
  private searchGrid_language(): void {
    this.gridSelection_Lang = [];

    let param = [{
        sel_langlcid: this.sel_langlcid
      , sel_langgrpkey: this.sel_langgrpkey
      , txtlangkey: this.txtlangkey
      , txtvalue: this.txtvalue
      , page_from : this.skip, page_to : this.skip + this.pageSize //page change
      , sort_dir : this.sort_dir , sort_field : this.sort_field //sort orderBy
    }];

    this.pmsApiService.fetch('languagemanage/languagemanage', param).subscribe(result => {

      this.gridData_Lang = result.data;
      //this.loadGrid_Lang(); //검색초기에 전체로 보기
      this.gridView_Lang = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData_Lang,
        total: result.totalcnt
      };
    })
  }

  private sortChange_Lang(sort: SortDescriptor[]): void {
    this.gridSort_Lang = sort;
    if (this.gridSort_Lang.length > 0) {
      if(this.gridSort_Lang[0].dir != undefined) this.sort_dir = this.gridSort_Lang[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.gridSort_Lang[0].field;
    }
    this.searchGrid_language();
  }

  protected pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.searchGrid_language();
    //this.searchGrid(); //DB를 붙이면 위에를 주석하고 아래를 이것을 사용 (우리는 DB에서 desc asc 및 15개씩 자름)
  }

  private saveHandler_Lang({ sender, rowIndex, formGroup}) {
    //해당열의 값을 가져오기 위하여 스킵한 행수만큼 - 해준다.
    rowIndex = rowIndex - sender.skip

    if (this.menu_id == "") {
      this.notificationService.smallBox({
        title: "메뉴목록을(를) 선택하세요.",
        content: "필수입력입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    //let save_role_id: String = this.gridView_Lang.data[rowIndex].role_id;
    //ADD 선택시 같이 추가되는 row를 선택
    this.gridSelection_Lang = [this.gridData_Lang[rowIndex].LANG_KEY];

    //이미 추가된 KEY가 있는지 확인
    for (let obj of this.gridData_MenuLang) {
              for (let key in obj) {
                  //console.log("key : " + if_key + ",  value : ", obj["nm"]);
                  if (obj["LANG_KEY"] == this.gridData_Lang[rowIndex].LANG_KEY)
                  {
                    this.notificationService.smallBox({
                      title: "다국어키을(를) 확인하세요.",
                      content: "중복입력입니다",
                      color: "#C46A69",
                      iconSmall: "fa fa-check fa-2x fadeInRight animated",
                      timeout: 2000
                    });
                    return;
                  }
          }
    }

    this.notificationService.smartMessageBox({
      title: "등록하시겠습니까?",
      content: "",
      buttons: '[취소][확인]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "확인") {

        let param = [{
            lang_m_company_cd : this.gridData_Lang[rowIndex].COMPANY_CD
          , lang_m_lcid : this.gridData_Lang[rowIndex].LANG_LCID
          , lang_m_grkey: this.gridData_Lang[rowIndex].LANG_GRKEY
          , lang_m_key: this.gridData_Lang[rowIndex].LANG_KEY
          , lang_m_nm: this.gridData_Lang[rowIndex].VALUE
          , lang_m_menu_id: this.menu_id
        }];

        this.pmsApiService.fetch('languagemanage/menulanguagemanage', param, "put").subscribe(result => {
          if (result.code == "00") {
            //this.gridSelection_Lang = [];
            this.searchGrid_language_menu();
          } else {
            alert("수정오류");
          }
        })

      }
      if (ButtonPressed === "취소") {
      }

    });

  }

  //컬럼 이름 변경
  private language_lcid(lcid) {
    //debugger
    let lang_nm;
    for (let obj of this.sel_langlcid_dt) {
              for (let key in obj) {
                  //console.log("key : " + if_key + ",  value : ", obj["nm"]);
                  if (obj["id"] == lcid) lang_nm = obj["nm"];
          }
    }
    return lang_nm;
  }

  private language_grkey(grkey) {
    //debugger
    let lang_key_nm;
    for (let obj of this.sel_langgrpkey_dt) {
              for (let key in obj) {
                  //console.log("key : " + if_key + ",  value : ", obj["nm"]);
                  if (obj["id"] == grkey) lang_key_nm = obj["nm"];
          }
    }
    return lang_key_nm;
  }
  //시스템다국어 ------------------------------------END



  //-----------메뉴 다국어 시작 --------------------------------------------
  private searchGrid_language_menu(): void {
    this.gridSelection_MenuLang = [];

    let param = [{
        lang_m_menu_id: this.menu_id
        , page_from : this.skip_MenuLang, page_to : this.skip_MenuLang + this.pageSize //page change
        , sort_dir : this.sort_dir , sort_field : this.sort_field //sort orderBy
    }];

    this.pmsApiService.fetch('languagemanage/menulanguagemanage', param).subscribe(result => {

      this.gridData_MenuLang = result.data;
      //this.loadGrid_Lang(); //검색초기에 전체로 보기
      this.gridView_MenuLang= {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData_MenuLang,
        total: result.totalcnt
      };

    })
  }

  private sortChange_MenuLang(sort: SortDescriptor[]): void {
    this.gridSort_MenuLang = sort;
    if (this.gridSort_MenuLang.length > 0) {
      if(this.gridSort_MenuLang[0].dir != undefined) this.sort_dir = this.gridSort_MenuLang[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.gridSort_MenuLang[0].field;
    }
    this.searchGrid_language_menu();
  }

  protected pageChange_Menu(event: PageChangeEvent): void {
    this.skip_MenuLang = event.skip;
    this.searchGrid_language_menu();
  }

  //컬럼이벤트
  private closeEditor(grid, rowIndex = this.editedRowIndex_MenuLang) {
    grid.closeRow(rowIndex);
    this.editedRowIndex_MenuLang = undefined;
    this.formGroup_MenuLang = undefined;
  }

  private editHandler_MenuLang({ sender, rowIndex, dataItem }) {

    this.closeEditor(sender);

    this.formGroup_MenuLang = new FormGroup({
      'VALUE': new FormControl(dataItem.VALUE)
    });

    this.editedRowIndex_MenuLang = rowIndex;
    sender.editRow(rowIndex, this.formGroup_MenuLang);

    //에디터 row선택
    this.gridSelection_MenuLang = [this.gridData_MenuLang[rowIndex].LANG_KEY];

    this.LANG_M_COMPANY_CD = dataItem.COMPANY_CD;
    this.LANG_M_LCID = dataItem.LANG_LCID;
    this.LANG_M_GRKEY = dataItem.LANG_GRKEY;
    this.LANG_M_KEY = dataItem.LANG_KEY;
  }

  private cancelHandler_MenuLang({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  private saveHandler_MenuLang({ sender, rowIndex, formGroup }) {
    let save_value_nm: String = formGroup.value.VALUE;

    if (save_value_nm == "") {
      this.notificationService.smallBox({
        title: "다국어명을(를) 입력하세요.",
        content: "필수입력입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    let param = [{
        lang_m_company_cd : this.LANG_M_COMPANY_CD
      , lang_m_lcid : this.LANG_M_LCID
      , lang_m_grkey: this.LANG_M_GRKEY
      , lang_m_key: this.LANG_M_KEY
      , lang_m_nm: save_value_nm
      , lang_m_menu_id: this.menu_id
    }];
    this.pmsApiService.fetch('languagemanage/menulanguagemanage', param, "patch").subscribe(result => {
      if (result.code == "00") {
        this.closeEditor(sender, rowIndex);
        this.searchGrid_language_menu();
      } else {
        alert("수정오류");
      }
    })
  }

  private removeHandler_MenuLang({ sender, rowIndex, formGroup }) {
    //삭제대상 선택
    this.gridSelection_MenuLang = [this.gridData_MenuLang[rowIndex].LANG_KEY];

    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        let param = "/" + this.gridData_MenuLang[rowIndex].COMPANY_CD +
                    "/" + this.gridData_MenuLang[rowIndex].LANG_GRKEY +
                    "/" + this.gridData_MenuLang[rowIndex].LANG_KEY +
                    "/" + this.menu_id;
        this.pmsApiService.fetch('languagemanage/menulanguagemanage', param, "delete").subscribe(result => {
          if (result.code == "00") {

              this.searchGrid_language_menu();

          } else {
            alert("오류 삭제");
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });
  }

}
