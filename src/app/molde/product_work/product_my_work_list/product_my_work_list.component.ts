import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridComponent } from '@progress/kendo-angular-grid';

import { ViewEncapsulation } from '@angular/core';
import { RowClassArgs,SelectAllCheckboxState } from '@progress/kendo-angular-grid';


@Component({
  selector: 'app-productmyworklist',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product_my_work_list.component.html',
  styleUrls: ['./product_my_work_list.component.css']
})

export class product_my_work_listComponent implements OnInit {
  user: any;

  //그리드
  private mySelection: any[] = [];
  private ExcelAllgridData: any[];
  private ExcelAllgridView: GridDataResult;
  private gridData: any[];
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort_dir: string = "";
  private sort_field: string = "";
  private sort: SortDescriptor[] = [];

  public order_no_text: string;
  public map_no_text: string;
  public product_no_text: string;
  public product_nm_text: string;

  public add_outsourcing_cd: string;
  public add_worker_id: string;
  public add_progress_cd: string;
  public add_facilities_cd: string;
  public add_vendor_id: string;
  public add_status_color_cd: string; //상태 색상
  public add_worker_list: Array<any>;
  public vendor_list: Array<any>;
  public progress_cd_list: Array<any>;
  public facilities_cd_list: Array<any>;
  public outsourcing_list: Array<any>;

  //작업관리팝업 상세정보 시작
  @Input() PRODUCT_WORK_ID: string;
  @Input() PRODUCT_WORK_TYPE: string = "MY";
  @Input() PRODUCT_WORK_MENU_ID: string = "52";
  @ViewChild('lgModal_pop_product_work_view') public lgModal_pop_product_work_view:ModalDirective;
  private Show_Pop_Product_Work_View_Modal():void {
     this.lgModal_pop_product_work_view.show();
  }

  private Hide_Pop_Product_Work_View_Modal():void {
     this.PRODUCT_WORK_ID = null;
     this.lgModal_pop_product_work_view.hide();
     this.searchGrid();
  }

  close_Pop_Product_Work_View_Modal() {
    this.PRODUCT_WORK_ID = null;
    this.lgModal_pop_product_work_view.hide();
  }
  //작업관리팝업 상세정보 끝

  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
    //this.allData = this.allData.bind(this);
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {

    this.add_outsourcing_cd = "all";
    this.add_worker_id = "all";
    this.add_status_color_cd = "all";
    this.order_no_text = "";
    this.map_no_text = "";
    this.product_no_text = "";
    this.product_nm_text = "";

    //공정리스트
    let param = [{
      main_cd: "BS00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.progress_cd_list = result.data;
    });
    this.add_progress_cd="all";
    this.add_facilities_cd  = "all";

    //외주구분(검색)
    param = [{
      main_cd: "BS00006"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.outsourcing_list = result.data;
    });
    this.add_outsourcing_cd="all";

    //업체리스트
    let param_vendor = [{
      vendor_tps: "AD00004_0001"
    }];
    this.pmsApiService.fetch('orderlist/vendor_combo', param_vendor).subscribe(result => {
      this.vendor_list = result.data;
    });
    this.add_vendor_id="all";

    this.searchGrid();
  }

  //공정
  change_facilities_list() {
    if(this.add_progress_cd != "all")
    {
      let paramP = [{
        main_cd: "BS00005"
        ,sub_cd: this.add_progress_cd
        ,lvl: "3"
      }];
      this.pmsApiService.fetch('WPCommon/commoncode_sublvl', paramP).subscribe(result => {
        this.facilities_cd_list = result.data;
        this.add_facilities_cd="all";
      });
    }
    else{
      this.facilities_cd_list = null;
      this.add_facilities_cd  = "all";
    }
  }

  change_company_worker_list(sc_name,val) {
    //BS00006_0001 사내 공정 작업 담당자
    //BS00006_0002 외주 AD00004_0002
    //BS00006_0003 구매 AD00004_0003
    //BS00006_0004 소재 AD00004_0004
    //BS00006_0005 면삭 AD00004_0008
    if(this[sc_name + "_outsourcing_cd"] != "all")
    {
      let paramP = [{
        select_gubun: this[sc_name + "_outsourcing_cd"]
      }];
      this.pmsApiService.fetch('WPCommon/WPCommon_Worker', paramP).subscribe(result => {
        //console.log(result.data)
        this[sc_name + "_worker_list"] = result.data;
      });

      this[sc_name + "_worker_id"] = "all";

    }
    else{
      this[sc_name + "_worker_list"] = null;
      this[sc_name + "_worker_id"] = "all";
    }

  }

  click_pop(event) {
    //event.columnIndex  :  현재 클릭된 컬럼 index 0부터~
    //if(event.columnIndex == "2")
    //{
      this.PRODUCT_WORK_ID = event.dataItem.PRODUCT_WORK_ID;
      this.lgModal_pop_product_work_view.show();
    //}
  }

  private sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    if (this.sort.length > 0) {
      if (this.sort[0].dir != undefined) this.sort_dir = this.sort[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.sort[0].field;
    }
    this.searchGrid();
  }

  protected pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.searchGrid();
  }

  private searchGrid(): void {

    this.mySelection = [];
    let param = [{
      //그리드 공통---start
      page_from: this.skip, page_to: this.skip + this.pageSize //page change
      , sort_dir: this.sort_dir, sort_field: this.sort_field //sort orderBy
      //그리드 공통---end
      , order_no_text: this.order_no_text
      , map_no_text: this.map_no_text
      , product_no_text: this.product_no_text
      , product_nm_text: this.product_nm_text

      , add_progress_cd : this.add_progress_cd
      , add_facilities_cd : this.add_facilities_cd
      , add_vendor_id : this.add_vendor_id
      , add_outsourcing_cd : this.add_outsourcing_cd
      , add_worker_id : this.add_worker_id
      , add_status_color_cd : this.add_status_color_cd
      , work_list_gubun : "ALL"
      , target_emp_no : this.user.empId
    }];

    this.pmsApiService.fetch('productwork/select_product_work_list', param).subscribe(result => {

      this.gridData = result.data;
      this.gridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData,
        total: result.cnt
      };
    })

    let param_all = [{
      //그리드 공통---start
      page_from: "0", page_to: "0" //page change
      , sort_dir: this.sort_dir, sort_field: this.sort_field //sort orderBy
      //그리드 공통---end
      , order_no_text: this.order_no_text
      , map_no_text: this.map_no_text
      , product_no_text: this.product_no_text
      , product_nm_text: this.product_nm_text

      , add_progress_cd : this.add_progress_cd
      , add_facilities_cd : this.add_facilities_cd
      , add_vendor_id : this.add_vendor_id
      , add_outsourcing_cd : this.add_outsourcing_cd
      , add_worker_id : this.add_worker_id
      , add_status_color_cd : this.add_status_color_cd
      , work_list_gubun : "ALL"
    }];

    this.pmsApiService.fetch('productwork/select_product_work_list', param_all).subscribe(result => {
      this.ExcelAllgridData = result.data;
      this.ExcelAllgridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.ExcelAllgridData,
        total: result.cnt
      };
    })
  }

  //row 색상
  public rowCallback(context: RowClassArgs) {

    //외주 이면서 입고마감일이 3일 남거나 5일 남은 경우 색상을 공통코드에서 색상을 가지고와서 표시해줌
    if(context.dataItem.OUT_COME_GUBUN == "D-5" || context.dataItem.OUT_COME_GUBUN == "D-3")
    {
      if(context.dataItem.OUT_COME_GUBUN == "D-3")
      {
        jQuery(".k-grid tr.d3").css('background-color', context.dataItem.OUT_COME_COLOR);
        return {d3: true};
      }
      else{
        jQuery(".k-grid tr.d5").css('background-color', context.dataItem.OUT_COME_COLOR);
        return {d5: true};
      }
    }
    else{
      //외주가 아닌 시작필요, 진행중, 지연,입고필요, 완료, 지연완료
      if(context.dataItem.COLOR_GUBUN == "blue")
      {
        return {
          //,'k-disabled': context.dataItem.CONFIRM_YN === "Y"
          blue: true};
      }
      else if(context.dataItem.COLOR_GUBUN == "gray")
      {
        return {gray: true};
      }
      else if(context.dataItem.COLOR_GUBUN == "red")
      {
        return {red: true};
      }
      else if(context.dataItem.COLOR_GUBUN == "green")
      {
        return {green: true};
      }
      else if(context.dataItem.COLOR_GUBUN == "yellow")
      {
        return {yellow: true};
      }
    }
  }

  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public onSelectedKeysChange(e) {
      const len = this.mySelection.length;

      if (len === 0) {
          this.selectAllState = 'unchecked';
      } else if (len > 0 && len < this.gridData.length) {
          this.selectAllState = 'indeterminate';
      } else {
          this.selectAllState = 'checked';
      }
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
      if (checkedState === 'checked') {
          // this.disable_Selection = [];
          // for (let i = 0; i < this.gridData.length; i++) {
          //     if(this.gridData[i].CONFIRM_YN != "Y")
          //     {
          //       //disable_Selection 에 넣는 이유
          //       //전체 선택시 완료된 컬럼은 업데이트 하지 않으려고
          //       this.disable_Selection.push(this.gridData[i].PRODUCT_WORK_ID)
          //
          //     }
          // }
          this.mySelection = this.gridData.map((item) => item.PRODUCT_WORK_ID);
          this.selectAllState = 'checked';
      } else {
          this.mySelection = [];
          this.selectAllState = 'unchecked';
      }
  }

  public exportToExcel(grid: GridComponent): void {
    grid.saveAsExcel();
  }

  public allData() {
       return this.ExcelAllgridView;
  }

  public onExcelExport(e: any): void {

    const rows = e.workbook.sheets[0].rows;

    // align multi header
    rows[0].cells[2].hAlign = 'center';

    // set alternating row color
    let altIdx = 0;
    rows.forEach((row) => {
        if (row.type === 'data') {
            if (altIdx % 2 !== 0) {
                row.cells.forEach((cell) => {
                    //cell.background = '#aabbcc';
                    cell.background = '';
                });
            }
            altIdx++;
        }
    });
  }



}
