import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent, ExcelModule } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';


declare var $: JQueryStatic;
import 'jqueryui';
import * as XLSX from 'ts-xlsx';



@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit {
  user: any;

  readonly_color: string = "";
  //저장용
  public add_order_id: String;

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
  //public add_complete_dt: String;
  //public add_delivery_dt: String;

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
  public order_tps: Array<any>;
  public proudct_tps: any[] = [];
  public proudct_tps_html: string = "";
  public proudct_del_ids: string = "0";
  public vendor_list: Array<any>;

  public sc_order_tp: string;
  public sc_order_city: string;
  public sc_vendor_id: string;
  //public sc_search_combo: string;
  //public sc_search_text: string;
  public order_no_text: string;
  public model_text: string;
  public product_text: string;

  btn_reg_hidden: boolean = false;
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

    this.sc_order_tp = "all";
    this.sc_order_city = "all";
    this.sc_vendor_id = "all";
    //this.sc_search_combo = "all";
    //this.sc_search_text = "";
    this.order_no_text = "";
    this.model_text = "";
    this.product_text = "";

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
      this.gridData = result.data;
      this.gridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData,
        total: result.cnt
      };
    })

  }

  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  close_lgModal_add() {
    this.lgModal_add.hide();
    this.mySelection = [];
    this.add_order_id = "0";
  }
  click_add(event) {
    //초기화
    this.add_order_id = "0";
    this.paper_id = "0";

    this.add_order_tp = "";
    this.add_order_city = "";
    this.add_vendor_id = "";
    this.add_order_no = "";

    this.add_model_nm = "";
    this.add_product_nm = "";
    this.add_volume = "";
    this.add_price = "";

    this.add_space = "";
    this.add_product_reg_yn = "";
    this.complete_dt.nativeElement.value = "";
    this.delivery_dt.nativeElement.value = "";
    //등록
    if (event == undefined) {
      this.readonly_color = "#fff";
      this.mySelection = [];
      this.btn_view_hidden = true;
      //this.btn_reg_hidden = false;

      this.input_disabled = false;
      this.file_view_yn = "N";
      this.modal_title = "수주 등록"
      this.lgModal_add.show();

    } else {
      //뷰모드
      this.readonly_color = "#eee";
      this.btn_view_hidden = false;
      //this.btn_reg_hidden = true;

      this.input_disabled = true;
      this.file_view_yn = "Y";
      this.modal_title = "수주 조회"

      this.add_order_id = (event.dataItem.ORDER_ID);
      this.paper_id = (event.dataItem.ORDER_ID);

      //수주번호
      if (event.columnIndex == 2) {
        this.lgModal_add.show();

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

  savedata_add() {
    if (this.save_Check("add_order_tp", "수주구분") == false) return;
    if (this.save_Check("add_order_city", "국내외") == false) return;
    if (this.save_Check("add_vendor_id", "업체명(약어)") == false) return;
    if (this.save_Check("add_order_no", "수주번호") == false) return;

    let param = [{
      emp_no: this.user.empId
      , order_id: this.add_order_id

      , order_tp: this.add_order_tp
      , order_city: this.add_order_city
      , vendor_id: this.add_vendor_id
      , order_no: this.add_order_no

      , model_nm: this.add_model_nm
      , product_nm: this.add_product_nm
      , volume: this.add_volume
      , price: this.add_price

      , space: this.add_space
      , product_reg_yn: this.add_product_reg_yn
      , complete_dt: this.complete_dt.nativeElement.value
      , delivery_dt: this.delivery_dt.nativeElement.value
      //첨부파일
      , attach_tp_il: this.attach_tp_il
      , attach_files_il: this.uploadFile_il
      , attach_tp_do: this.attach_tp_do
      , attach_files_do: this.uploadFile_do
    }];


    this.pmsApiService.fetch('orderlist/order', param, "put").subscribe(result => {
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
      order_id: this.add_order_id
    }];

    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        this.pmsApiService.fetch('orderlist/order_remove', param, "put").subscribe(result => {
          if (result.code == "00") {
            this.lgModal_add.hide();
            this.add_order_id = "0"
            this.searchGrid();
          } else {
            alert("오류 삭제");
          }
        })
      }
      if (ButtonPressed === "취소") {

      }

    });
  }

  savedata_edit() {
    this.readonly_color = "#fff";
    this.btn_view_hidden = true;
    //this.btn_reg_hidden = false;

    this.input_disabled = false;
    this.file_view_yn = "N";
    this.modal_title = "수주 등록"
  }

  public uploadFile_il;
  uploadFilesNm_IL(fileList: any[]) {
    if (fileList.length > 0) {
      this.uploadFile_il = fileList.join("¿");
    } else {
      this.uploadFile_il = [];
    }
  }

  public uploadFile_do;
  uploadFilesNm_DO(fileList: any[]) {
    if (fileList.length > 0) {
      this.uploadFile_do = fileList.join("¿");
    } else {
      this.uploadFile_do = [];
    }
  }









  //제품등록
  @ViewChild('lgModal_add2') public lgModal_add2: ModalDirective;
  tr_seq: number = 0;

  product_add() {
    //초기화
    this.tr_seq = 0;
    this.proudct_del_ids = "0";

    this.lgModal_add2.show();
    $("#tbody_product").html("");

    let param = [{
      order_id: this.add_order_id
    }];
    this.pmsApiService.fetch('orderlist/product_search', param).subscribe(result => {
      if (result.code == "00") {
        if (result.data.length == 0) {
          this.product_html();
        } else {
          for (let i = 0; i < result.data.length; i++) {
            this.product_html();
            $("#USE_DATA_" + this.tr_seq).val(result.data[i].use_data);
            $("#PRODUCT_ID_" + this.tr_seq).val(result.data[i].product_id);
            $("#MAP_NO_" + this.tr_seq).val(result.data[i].map_no);
            $("#PRODUCT_NO_" + this.tr_seq).val(result.data[i].product_no);
            $("#PRODUCT_NM_" + this.tr_seq).val(result.data[i].product_nm);
            $("#MATERIAL_" + this.tr_seq).val(result.data[i].material);
            $("#SIZE_" + this.tr_seq).val(result.data[i].size);
            $("#VOLUME_" + this.tr_seq).val(result.data[i].volume);
            $("#GUBUN_" + this.tr_seq).val(result.data[i].gubun);
          }
        }
      } else {
        alert("오류 등록");
      }
    });
  }


  product_html() {
    this.tr_seq += 1;
    // <td><input style="width:60px;" type="text" value='` + this.add_vendor_s_nm + `' disabled /></td>
    // <td><input style="width:80px;" type="text" value='` + this.add_order_no + `' disabled  /></td>
    let html = `
    <tr id='tr_`+ this.tr_seq + `'>
      <td><input style="width:100%;" type="text" id="MAP_NO_` + this.tr_seq + `"  /></td>
      <td><input style="width:100%;" type="text" id="PRODUCT_NO_` + this.tr_seq + `"  /></td>
      <td><input style="width:100%;" type="text" id="PRODUCT_NM_` + this.tr_seq + `"  /></td>
      <td><input style="width:100%;" type="text" id="MATERIAL_` + this.tr_seq + `"  /></td>
      <td><input style="width:100%;" type="text" id="SIZE_` + this.tr_seq + `"  /></td>
      <td><input style="width:100%;" type="text" id="VOLUME_` + this.tr_seq + `"  /></td>
      <td><select style="width:100%;" id="GUBUN_` + this.tr_seq + `"><option value="">선택</option>` + this.proudct_tps_html + `</select></td>
      <td>
        <button class="btn btn-default btn-xs" id="btn_tb_del_`+ this.tr_seq + `" >삭제</button>
        <input style="width:150px;" type="hidden" id="PRODUCT_ID_` + this.tr_seq + `" value="0"  />
        <input style="width:150px;" type="hidden" id="USE_DATA_` + this.tr_seq + `"  />
      </td>
    </tr>
    `;
    $("#tbody_product").append(html);

    let _this = this;
    $("#btn_tb_del_" + this.tr_seq).bind('click', function() {
      let key = (this.id.split("_")[3]);
      if ($("#USE_DATA_" + key).val() == "Y") {
        _this.notificationService.smallBox({
          title: "해당 제품에 등록된 공정이 있습니다.",
          content: "삭제할 수 없습니다.",
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
      }
      $("#tr_" + key).hide();
      _this.proudct_del_ids += ("," + $("#PRODUCT_ID_" + key).val());
    });
  }

  //전체삭제 : ui에서만 임시삭제
  deldata_product() {
    let txt_title = "";
    let ret = true;

    for (let i = 1; i <= this.tr_seq; i++) {
      this.proudct_del_ids += ("," + $("#PRODUCT_ID_" + i).val());
      if ($("#tr_" + i).css("display") != "none") {
        if ($("#USE_DATA_" + i).val() == "Y") {
          if (txt_title != "") txt_title += ", ";
          txt_title += $("#MAP_NO_" + i).val();
        }
      }
    }

    if (txt_title != "") {
      this.notificationService.smallBox({
        title: "도면번호[" + txt_title + "]에 등록된 공정이 있습니다.",
        content: "삭제할 수 없습니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false
    } else {
      $("#tbody_product").html("");
    }

    return ret;
  }

  savedata_product() {
    for (let i = 1; i <= this.tr_seq; i++) {
      if ($("#tr_" + i).css("display") != "none") {
        if ($("#MAP_NO_" + i).val() == "") {
          this.notificationService.smallBox({
            title: "도면번호을(를) 입력하세요.",
            content: "필수입력입니다.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
          $("#MAP_NO_" + i).focus();

          return;
        } else if ($("#PRODUCT_NO_" + i).val() == "") {
          this.notificationService.smallBox({
            title: "품번(를) 입력하세요.",
            content: "필수입력입니다.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
          $("#PRODUCT_NO_" + i).focus();
          return;
        } else if ($("#PRODUCT_NM_" + i).val() == "") {
          this.notificationService.smallBox({
            title: "품명을(를) 입력하세요.",
            content: "필수입력입니다.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
          $("#PRODUCT_NM_" + i).focus();
          return;
        }
      }
    }

    //삭제
    let param = [{
      proudct_del_ids: this.proudct_del_ids
    }];
    this.pmsApiService.fetch('orderlist/product_del', param, "put").subscribe(result => {
      if (result.code == "00") {
        this.lgModal_add2.hide();
      } else {
        alert("오류 등록");
      }
    })

    //등록
    for (let i = 1; i <= this.tr_seq; i++) {

      if (($("#tr_" + i).css("display") || "none") != "none") {
        let param = [{
          emp_no: this.user.empId
          , order_id: this.add_order_id
          , product_id: $("#PRODUCT_ID_" + i).val()
          , map_no: $("#MAP_NO_" + i).val()
          , product_no: $("#PRODUCT_NO_" + i).val()
          , product_nm: $("#PRODUCT_NM_" + i).val()
          , material: $("#MATERIAL_" + i).val()
          , size: $("#SIZE_" + i).val()
          , volume: $("#VOLUME_" + i).val()
          , gubun: $("#GUBUN_" + i).val()
          , sort_num: i
          , size_1 : ($("#SIZE_" + i).val().toUpperCase().split("X")[0] || "")
          , size_2 : ($("#SIZE_" + i).val().toUpperCase().split("X")[1] || "")
          , size_3 : ($("#SIZE_" + i).val().toUpperCase().split("X")[2] || "")
        }];
        this.proudct_save(param);
        if (this.tr_seq == i) {
          this.lgModal_add2.hide();
        }
      }
    }
  }

  excel_save(excelList: any) {
    //전체 삭제 및 신규 등록
    let param_del = [{
      order_id: this.add_order_id
    }];

    // this.pmsApiService.fetch('orderlist/product_del_all', param_del, "put").subscribe(result => {
    //   if (result.code == "00") {
    //     for (let i = 0; i < excelList.length; i++) {
    //       let param = [{
    //         emp_no: this.user.empId
    //         , order_id: this.add_order_id
    //         , product_id: "0"
    //         , map_no: (excelList[i]["도면번호"] || "")
    //         , product_no: (excelList[i]["품번"] || "")
    //         , product_nm: (excelList[i]["품명"] || "")
    //         , material: (excelList[i]["재질"] || "")
    //         , size: (excelList[i]["사이즈"] || "")
    //         , volume: (excelList[i]["수량"] || "")
    //         , gubun: (this.proudct_tps[excelList[i]["구분"]] || "")
    //         , sort_num: i
    //       }];
    //       this.proudct_save(param);
    //       setTimeout(() => {
    //         if ((excelList.length - 1) == i) {
    //           this.lgModal_add3.hide();
    //           this.product_add();
    //         }
    //       }, 500);
    //     }
    //   }
    // })

    for (let i = 0; i < excelList.length; i++) {
      let param = [{
        emp_no: this.user.empId
        , order_id: this.add_order_id
        , product_id: "0"
        , map_no: (excelList[i]["도면번호"] || "")
        , product_no: (excelList[i]["품번"] || "")
        , product_nm: (excelList[i]["품명"] || "")
        , material: (excelList[i]["재질"] || "")
        , size: (excelList[i]["사이즈"] || "")
        , volume: (excelList[i]["수량"] || "")
        , gubun: (this.proudct_tps[excelList[i]["구분"]] || "")
        , sort_num: i
        , size_1 : ((excelList[i]["사이즈"] || "").toUpperCase().split("X")[0] || "")
        , size_2 : ((excelList[i]["사이즈"] || "").toUpperCase().split("X")[1] || "")
        , size_3 : ((excelList[i]["사이즈"] || "").toUpperCase().split("X")[2] || "")
      }];
      this.proudct_save(param);
      setTimeout(() => {
        if ((excelList.length - 1) == i) {
          this.lgModal_add3.hide();
          this.product_add();
        }
      }, 500);
    }

  }

  proudct_save(param) {
    this.pmsApiService.fetch('orderlist/product_add', param, "put").subscribe(result => {
      if (result.code == "00") {

      } else {
        alert("오류 등록");
      }
    })
  }








  //excel import
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }
  @ViewChild('lgModal_add3') public lgModal_add3: ModalDirective;
  pop_lgModal_add3() {
    this.lgModal_add3.show()
  }

  excel_import() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      //var first_sheet_name = workbook.SheetNames[0];
      var first_sheet_name = "UploadSheet";
      var worksheet = workbook.Sheets[first_sheet_name];
      this.excel_save(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    }
    fileReader.readAsArrayBuffer(this.file);
  }







  //공정계획수립
  @ViewChild('lgModal_add_plan') public lgModal_add_plan: ModalDirective;
  pop_plan() {
    if ((this.add_order_id || "0") == "0") {
      this.notificationService.smallBox({
        title: "수주정보를 선택하세요.",
        content: "수주정보는 필수입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    };
    this.lgModal_add_plan.show();
  }











}
