import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";

import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-orderselect',
  templateUrl: './order_select.component.html',

})
export class Order_selectComponent implements OnInit {
  order_id =  "";
  order_no =  "";
  @Output() Modal_order_Close = new EventEmitter();
  @Output() Modal_order_Search = new EventEmitter();

  SelectOk() {
    this.Modal_order_Search.emit(this.order_id + "＆" + this.order_no);
  }

  CloseOk() {
    this.Modal_order_Close.emit('');
  }

  //그리드
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort_dir: string = "";
  private sort_field: string = "";
  private sort: SortDescriptor[] = [];


  //전역변수
  public order_tps: Array<any>;
  public vendor_list: Array<any>;

  public sc_order_tp: string;
  public sc_order_city: string;
  public sc_vendor_id: string;
  //public sc_search_combo: string;
  //public sc_search_text: string;
  public order_no_text: string;
  public model_text: string;
  public product_text: string;

  constructor(
    private pmsApiService: PmsApiService
  ) {}

  ngOnInit() {
    this.sc_order_tp = "all";
    this.sc_order_city = "all";
    this.sc_vendor_id = "all";
    //this.sc_search_combo = "all";
    //this.sc_search_text = "";
    this.order_no_text = "";
    this.model_text = "";
    this.product_text = "";
    this.skip = 0;

    //공통코드-수주관리 구분
    let param = [{
      main_cd: "AD00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.order_tps = result.data;
    });

    //업체리스트
    let param_vendor = [{
      vendor_tps: "AD00004_0001"
    }];
    this.pmsApiService.fetch('orderlist/vendor_combo', param_vendor).subscribe(result => {
      this.vendor_list = result.data;
    });

    this.searchGrid();
  }

  ngOnChanges() {

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
    let param = [{
      //그리드 공통---start
      page_from: this.skip, page_to: this.skip + this.pageSize //page change
      , sort_dir: this.sort_dir, sort_field: this.sort_field //sort orderBy
      //그리드 공통---end
      , sc_order_tp: this.sc_order_tp
      , sc_order_city: this.sc_order_city
      , sc_vendor_id: this.sc_vendor_id
      //, sc_search_combo: this.sc_search_combo
      //, sc_search_text: this.sc_search_text
      , order_no_text: (this.order_no_text || "")
      , model_text: (this.model_text || "")
      , product_text: (this.product_text || "")
    }];
    this.pmsApiService.fetch('orderlist/grid', param).subscribe(result => {
      this.gridView = {
        data: result.data,
        total: result.cnt
      };
    })
  }

  cellClick(event) {
    this.order_id = event.dataItem.ORDER_ID;
    this.order_no = event.dataItem.ORDER_NO;
  }
}
