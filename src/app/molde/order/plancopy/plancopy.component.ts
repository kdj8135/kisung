import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";

import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-plancopy',
  templateUrl: './plancopy.component.html',
  //styleUrls: ['./productplan.component.css'],

})
export class PlancopyComponent implements OnInit {
  @Input() product_id: string;
  @Output() copy_close = new EventEmitter(); //모달 닫기
  @Output() copy_search = new EventEmitter(); //모달 닫기후 조회

  closePop() {
    this.copy_close.emit('');
  }


  user: any;

  //그리드
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort_dir: string = "";
  private sort_field: string = "";
  private sort: SortDescriptor[] = [];

  private gridView_sub: GridDataResult;
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

  //복사할 ID
  copy_product_id;
  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }



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
    this.sc_order_tp = "all";
    this.sc_order_city = "all";
    this.sc_vendor_id = "all";
    //this.sc_search_combo = "all";
    //this.sc_search_text = "";
    this.skip = 0;

    this.searchGrid();
    this.gridView_sub = null;
    this.copy_product_id = null;
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

  click_main(event) {
    let param = [{
      order_id: event.dataItem.ORDER_ID
    }];
    this.pmsApiService.fetch('orderlist/product_search', param).subscribe(result => {
      if (result.code == "00") {
        this.gridView_sub = {
          data: result.data
          , total: result.data.length
        };
      }
    });
  }

  click_sub(event) {
    this.copy_product_id = event.dataItem.product_id;
  }

  copy() {
    if ((this.copy_product_id || "") == "") {
      this.notificationService.smallBox({
        title: "복사할 도면을 선택하세요.",
        content: "복사 할 수 없습니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    let param = [{
      emp_no: this.user.empId,
      product_id: this.product_id,
      copy_id: this.copy_product_id
    }];

    this.notificationService.smartMessageBox({
      title: "선택한 공정계획으로 복사하시겠습니까?",
      content: "해당 제품의 공정은 삭제됩니다.",
      buttons: '[취소][복사]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "복사") {
        this.pmsApiService.fetch('productwork/product_work_copy', param, "put").subscribe(result => {
          if (result.code == "00") {
            this.gridView_sub = null;
            this.copy_product_id = null;
            this.closePop();
            this.copy_search.emit('');
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
