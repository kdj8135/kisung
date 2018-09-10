import { Component, OnInit } from '@angular/core';

import { PmsApiService } from "../../../core/api/pms-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings,DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { NotificationService } from "../../../shared/utils/notification.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';

export class SelectBox {
  constructor(public id: string, public nm: string) { }
}

@Component({
  selector: 'app-languagemanage',
  templateUrl: './languagemanage.component.html',
  styleUrls: ['./languagemanage.component.css']
})
export class LanguagemanageComponent implements OnInit {


    constructor(
      private pmsApiService: PmsApiService
      , private notificationService: NotificationService
    ) {
      this.Bind_Languagemanage_Data("sel_langlcid");
      this.Bind_Languagemanage_Data("sel_langgrpkey");
      this.searchGrid_language();
    }

    private sel_langlcid_dt : any[];    //for문을 위하여
    private sel_langgrpkey_dt : any[];    //for문을 위하여

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

    private editedRowIndex: number;
    private formGroup: FormGroup;

    private LANG_M_COMPANY_CD: String = "";
    private LANG_M_LCID: String = "";
    private LANG_M_GRKEY: String = "";
    private LANG_M_KEY: String = "";

    ngOnInit() {
    }

    //셀렉트 박스 그룹 시작
    //1. 셀렉트 박스에 넣을 DB조회하여  ID, VALUE 가져오기
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




    //다국어목록 ------------------------------------start
    private searchGrid_language(): void {
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
      //this.loadProducts();
      this.searchGrid_language();
    }

    protected pageChange(event: PageChangeEvent): void {
      this.skip = event.skip;
      this.searchGrid_language();
      //this.searchGrid(); //DB를 붙이면 위에를 주석하고 아래를 이것을 사용 (우리는 DB에서 desc asc 및 15개씩 자름)
    }

    private OnClickEvent(event) {
      //this.mySelection 키로 해당 그리드 모든 정보 찾기
      if(event.columnIndex == "2")
      {
        //this.role_id = event.dataItem.EMP_NO;
      }
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }

    private editHandler({ sender, rowIndex, dataItem }) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
        'VALUE': new FormControl(dataItem.VALUE)
      });

      this.editedRowIndex = rowIndex;
      sender.editRow(rowIndex, this.formGroup);

      this.LANG_M_COMPANY_CD = dataItem.COMPANY_CD;
      this.LANG_M_LCID = dataItem.LANG_LCID;
      this.LANG_M_GRKEY = dataItem.LANG_GRKEY;
      this.LANG_M_KEY = dataItem.LANG_KEY;
    }

    private cancelHandler({ sender, rowIndex }) {
      this.closeEditor(sender, rowIndex);
    }

    private saveHandler({ sender, rowIndex, formGroup, isNew }) {
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

      if (isNew == false) {
        //let save_role_id: String = this.gridView_Lang.data[rowIndex].role_id;
        let param = [{

            lang_m_company_cd : this.LANG_M_COMPANY_CD
          , lang_m_lcid : this.LANG_M_LCID
          , lang_m_grkey: this.LANG_M_GRKEY
          , lang_m_key: this.LANG_M_KEY
          , lang_m_nm: save_value_nm
        }];
        this.pmsApiService.fetch('languagemanage/languagemanage', param, "patch").subscribe(result => {
          if (result.code == "00") {
            this.closeEditor(sender, rowIndex);
            this.gridSelection_Lang = [];
            this.searchGrid_language();
          } else {
            alert("수정오류");
          }
        })
      }
    }

    //다국어목록 ------------------------------------end

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
                    console.log("key : " + key + ",  value : ", obj["nm"]);
                    if (obj["id"] == grkey) lang_key_nm = obj["nm"];
            }
      }
      return lang_key_nm;
    }
}
