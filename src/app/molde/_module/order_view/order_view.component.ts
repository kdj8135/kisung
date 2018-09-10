import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-orderview',
  templateUrl: './order_view.component.html',
  styleUrls: ['./order_view.component.css']
})
export class Order_viewComponent implements OnInit {
  user: any;

  readonly_color : string = "";

  @Input() add_order_id: string = "";
  @Output() order_view_close = new EventEmitter(); //등록창 닫기
  closeview(){
    this.order_view_close.emit('');
  }

  public add_order_tp: String;
  public add_order_city: String;
  public add_vendor_id: String;
  add_vendor_s_nm: String;
  add_order_no: String;

  public add_model_nm: String;
  public add_product_nm: String;
  public add_volume: String;
  public add_price: String;

  public add_space: String;
  public add_product_reg_yn: String;
  @ViewChild('complete_dt') complete_dt: ElementRef;
  @ViewChild('delivery_dt') delivery_dt: ElementRef;

  //전역변수
  public order_tps: Array<any>;
  public proudct_tps: any[] = [];
  public proudct_tps_html: string = "";
  public proudct_del_ids: string = "0";
  public vendor_list: Array<any>;

  btn_view_hidden: boolean = false;
  input_disabled: boolean = false;

  modal_title: string;
  //첨부파일
  public attach_tp_il: String;
  public attach_tp_do: String;
  public paper_id: String;
  public file_view_yn: string;
  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }


  ngOnInit() {
    this.attach_tp_il = "VENDOR_IL";
    this.attach_tp_do = "VENDOR_DO";

    //공통코드-수주관리 구분
    let param = [{
      main_cd: "AD00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.order_tps = result.data;
    });
    //공통코드-업체관리 구분
    param = [{
      main_cd: "AD00006"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      for (let i = 0; i < result.data.length; i++) {
        this.proudct_tps[result.data[i].SUB_NM] = result.data[i].SUB_CD;
        this.proudct_tps_html += `<option value="` + result.data[i].SUB_CD + `">` + result.data[i].SUB_NM + `</option>`
      }
    });

    //업체리스트
    let param_vendor = [{
      vendor_tps: "AD00004_0001"
    }];
    this.pmsApiService.fetch('orderlist/vendor_combo', param_vendor).subscribe(result => {
      this.vendor_list = result.data;
    });
  }

  ngOnChanges() {
    this.search();
  }

  search() {
    if (this.add_order_id == undefined || this.add_order_id == "0") return;
    //뷰모드
    this.paper_id = this.add_order_id;
    this.readonly_color = "#eee";
    this.input_disabled = true;
    this.file_view_yn = "Y";
    this.modal_title = "수주 조회"

    let param = [{
      order_id: this.add_order_id
    }];

    this.pmsApiService.fetch('orderlist/view', param).subscribe(result => {
      if (result.code == "00") {
        for (let obj of result.data) {
          for (let key in obj) {
            this["add_" + key] = obj[key];
          }
        }
        this.complete_dt.nativeElement.value = result.data[0].complete_dt;
        this.delivery_dt.nativeElement.value = result.data[0].delivery_dt;
      } else {
        alert("오류 뷰조회");
      }
    })

  }

}
