import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.css']
})
export class VendorlistComponent implements OnInit {
  user: any;
  //저장용
  public add_vendor_id: String;

  public add_vendor_tp: String;
  public add_vendor_city: String;
  public add_vendor_s_nm: String;
  public add_vendor_nm: String;

  public add_tel_no: String;
  public add_fax_no: String;
  public add_owner: String;
  public add_owner_tel_no: String;

  public add_business: String;
  public add_email: String;

  public add_addr_no: String;
  public add_addr_1: String;
  public add_addr_2: String;

  public add_memo: String;

  //그리드
  private mySelection: any[] = [];
  private gridData: any[];
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort_dir: string = "";
  private sort_field: string = "";
  private sort: SortDescriptor[] = [];

  //전역변수
  public vendor_tps: Array<any>
  btn_del_hidden : boolean = false;
  public sc_combo : string;
  public sc_textbox : string;
  daumAddressOptions =  {
    class: ['btn', 'btn-primary btn-sm']
  };
   @ViewChild('addrDetail') inputAddrDetail: ElementRef;
   @ViewChild('addrDetail1') inputAddrDetail1: ElementRef;

  setDaumAddressApi(data){
    // 여기로 주소값이 반환
    this.add_addr_no = data.zip;
    this.add_addr_1 = data.addr;

    setTimeout(() => {
      this.inputAddrDetail1.nativeElement.focus();
      this.inputAddrDetail.nativeElement.focus();
    }, 100);

  }


  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }

  ngOnInit() {
    this.sc_combo = "all";
    this.sc_textbox = "";
    let param = [{
      main_cd : "AD00004"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.vendor_tps = result.data;
    });

    this.searchGrid();
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
      , sc_combo : this.sc_combo, sc_textbox : this.sc_textbox
    }];
    this.pmsApiService.fetch('vendorlist/vendor', param).subscribe(result => {

      this.gridData = result.data;

      //alert(result.totalcnt);

      this.gridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData,
        total: result.cnt
      };
    })

  }



  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  click_add(event) {
    //등록
    this.lgModal_add.show();
    //초기화
    this.add_vendor_id = "0";

    this.add_vendor_tp = "";
    this.add_vendor_city = "";
    this.add_vendor_nm = "";
    this.add_vendor_s_nm = "";

    this.add_owner = "";
    this.add_owner_tel_no = "";
    this.add_tel_no = "";
    this.add_fax_no = "";

    this.add_business = "";
    this.add_email = "";

    this.add_addr_no = "";
    this.add_addr_1 = "";
    this.add_addr_2 = "";

    this.add_memo = "";

    if (event == undefined) {
      this.btn_del_hidden = true;
    } else {
      this.btn_del_hidden = false;
      this.add_vendor_id = (event.dataItem.VENDOR_ID);
      let param = [{
        vendor_id: this.add_vendor_id
      }];

      this.pmsApiService.fetch('vendorlist/view', param).subscribe(result => {
        if (result.code == "00") {
          for (let obj of result.data) {
            for (let key in obj) {
              this["add_" + key] = obj[key];
            }
          }
        } else {
          alert("오류 뷰조회");
        }
      })

    }
  }

  save_Check (key, text) : Boolean {
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

  savedata_add() {
    if (this.save_Check("add_vendor_tp", "구분") == false) return;
    if (this.save_Check("add_vendor_city", "국내외") == false) return;
    if (this.save_Check("add_vendor_s_nm", "약어") == false) return;
    if (this.save_Check("add_vendor_nm", "업체명") == false) return;


    let param = [{
      emp_no: this.user.empId
      , vendor_id: this.add_vendor_id

      , vendor_tp: this.add_vendor_tp
      , vendor_city: this.add_vendor_city
      , vendor_s_nm: this.add_vendor_s_nm
      , vendor_nm: this.add_vendor_nm

      , owner: this.add_owner
      , owner_tel_no : this.add_owner_tel_no
      , tel_no: this.add_tel_no
      , fax_no: this.add_fax_no

      , business : this.add_business
      , email : this.add_email

      , addr_no : this.add_addr_no
      , addr1 : this.add_addr_1
      , addr2 : this.add_addr_2

      , memo : this.add_memo
    }];


    this.pmsApiService.fetch('vendorlist/vendor', param, "put").subscribe(result => {
      if (result.code == "00") {
        this.lgModal_add.hide();
        this.searchGrid();
      } else {
        alert("오류 등록");
      }
    })
  }

  savedata_remove() {
    let param = [{
      vendor_id: this.add_vendor_id
    }];


    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        this.pmsApiService.fetch('vendorlist/vendor_remove', param, "put").subscribe(result => {
          if (result.code == "00") {
            this.lgModal_add.hide();
            this.add_vendor_id = "0"
            this.searchGrid();
          } else {
            this.notificationService.smallBox({
              title: "삭제할 수 없습니다.",
              content: "삭제할 업체가 참여된 데이터가 존재합니다.",
              color: "#C46A69",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            return;
          }
        })

      }
      if (ButtonPressed === "취소") {

      }

    });
  }
}
