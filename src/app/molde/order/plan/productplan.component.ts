import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { DataEvent, DragDropEvent } from '@progress/kendo-angular-sortable';

import { HostListener } from "@angular/core";


import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { pmsConfig } from '../../../shared/pms.config';

@Component({
  selector: 'app-productplan',
  templateUrl: './productplan.component.html',
  styleUrls: ['./productplan.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductplanComponent implements OnInit {
  win_height;
  win_height_sub;
  win_width;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.win_width = { 'width': (window.innerWidth - 80) + 'px' };
    this.win_height = { 'height': (window.innerHeight - 80) + 'px' };
    this.win_height_sub = { 'height': (window.innerHeight - 330) + 'px', 'overflow': 'auto' };
  }

  user: any;
  @Input() order_id: string;
  @Output() plan_close = new EventEmitter(); //등록창 닫기
  closePop() {
    this.plan_close.emit('');
  }

  productList: any[] = [];
  sumList: any[] = [];
  private product: any[];
  public work_del_ids: string = "0";

  items_default: any[] = [];
  items_save: any[] = [];
  commoncodelist: any[] = [];
  def_rt_list: any[] = [];
  def_rt_disabled: boolean = true;

  code_sum = [];
  topInfo = [];
  info_sum = 0;
  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
    this.onResize();
  }

  ngOnInit() { }

  ngOnChanges() {
    this.commoncodeList();
    this.searchData();
  }

  //수주조회 팝업전용 시작
  @ViewChild('lgModal_pop_order_view') public lgModal_pop_order_view: ModalDirective;
  private Show_Pop_order_Modal(): void {
    this.lgModal_pop_order_view.show();
  }
  //수주조회 팝업전용 끝

  //외주조회 팝업전용 시작
  amt_order_id;
  @ViewChild('lgModal_pop_outsourcing_amt_view') public lgModal_pop_outsourcing_amt_view: ModalDirective;
  private open_lgModal_out_amt(): void {
    this.amt_order_id = this.order_id;
    this.lgModal_pop_outsourcing_amt_view.show();
  }

  close_lgModal_out_amt() {
    this.amt_order_id = null;
    this.lgModal_pop_outsourcing_amt_view.hide();
  }
  //외주조회 팝업전용 끝

  //공통코드-표준공정
  commoncodeList() {
    let param = [{}];
    this.pmsApiService.fetch('productwork/commoncodebycolor', param).subscribe(result => {
      this.commoncodelist = (result.data);
      this.items_default = this.commoncodelist;
    });
  }


  //공정계획수립------------------start-----------------------------
  searchData() {
    if (this.order_id == undefined) return;

    this.code_sum = [];
    this.productList = [];

    let param = [{
      order_id: this.order_id
    }];

    //본문정보
    this.pmsApiService.fetch('orderlist/product_search', param).subscribe(result => {
      if (result.code == "00") {
        if (result.data.length > 0) {

          for (let i = 0; i < result.data.length; i++) {
            let param_sub = [{ order_id: this.order_id, product_id: result.data[i]["product_id"] }];
            this.pmsApiService.fetch('productwork/work_plan', param_sub).subscribe(result_sub => {
              if (result_sub.code == "00") {

                //정렬
                result_sub.data.sort((a, b) => a["sort_num"] > b["sort_num"] ? 1 : a["sort_num"] === b["sort_num"] ? 0 : -1);
                this.productList.push({
                  //공정 계획 수립 화면의 상세 항목 : 품번, 품명, 수량, Size 필드 추가 하고 그 다음 부품별 제.가 소계 항목 추가
                  product_id: result.data[i]["product_id"],

                  product_no: result.data[i]["product_no"],
                  product_nm: result.data[i]["product_nm"],
                  volume: result.data[i]["volume"],
                  size: result.data[i]["size"],

                  map_no: result.data[i]["map_no"],
                  sort_num: result.data[i]["sort_num"],
                  works: result_sub.data
                });

                //최종결과물 설정
                if (i == (result.data.length - 1)) {
                  setTimeout(() => {
                    this.setRes();
                  }, 400);
                }

              }
            });
          }
        }
      } else {
        alert("오류 등록");
      }
    });

    //기본정보
    this.pmsApiService.fetch('productwork/info', param).subscribe(result => {
      if (result.code == "00") {

        for (let obj of result.data) {
          for (let key in obj) {
            this.topInfo[key] = obj[key];
          }
        }
      } else {
        alert("오류 등록");
      }
    });
  }

  st_keyup(tp: string, event: any) {
    //this.productList에서 해당 값을 치환해준다.
    var target = document.getElementById((event.target.id));
    let p_id = (target.id.split("_")[1]);
    let w_id = (target.id.split("_")[2]);

    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i]["product_id"] == p_id) {

        for (let j = 0; j < this.productList[i]["works"].length; j++) {
          if (this.productList[i]["works"][j]["product_work_id"] == w_id) {
            //this.productList[i]["works"][j]["plan_price"] = target_im["value"] * event.target.value;
            this.productList[i]["works"][j]["plan_st"] = event.target.value;
            //blur일때만 소수점 체크 로직 추가
            if (tp == "blur") {
              this.productList[i]["works"][j]["plan_st"] = Number(this.productList[i]["works"][j]["plan_st"]).toFixed(1);
            }
            break;
          }
        }

      }
    }

    this.setRes();
  }

  setRes() {

    this.code_sum = [];
    for (let i = 0; i < this.productList.length; i++) {
      for (let j = 0; j < this.productList[i]["works"].length; j++) {
        if (this.code_sum[this.productList[i]["works"][j]["work_cd"]] != undefined) {
          this.code_sum[this.productList[i]["works"][j]["work_cd"]] += Number((this.productList[i]["works"][j]["plan_st"] || 0));
        } else {
          this.code_sum[this.productList[i]["works"][j]["work_cd"]] = Number((this.productList[i]["works"][j]["plan_st"] || 0));
        }
      }
    }

    let tot_sum = [];
    let tot_sum_class = [];
    for (let i = 0; i < this.productList.length; i++) {
      let sub_sum = 0;
      for (let j = 0; j < this.productList[i]["works"].length; j++) {
        let st_fr = this.productList[i]["works"][j]["std_st"].split("-")[0];
        let st_to = this.productList[i]["works"][j]["std_st"].split("-")[1];
        let tot_st = this.productList[i]["works"][j]["tot_st"];
        let plan_st = this.productList[i]["works"][j]["plan_st"];
        let work_cd = this.productList[i]["works"][j]["work_cd"];

        //색 지정
        let sum = (this.code_sum[work_cd] || 0) + (tot_st || 0);
        if (st_fr > sum) {
          this.productList[i]["works"][j]["class"] = "badge bg-color-green";
        } else if (st_to < sum) {
          this.productList[i]["works"][j]["class"] = "badge bg-color-red";
        } else {
          this.productList[i]["works"][j]["class"] = "badge bg-color-yellow";
        }

        //진행중일때는 초록색
        if (this.productList[i]["works"][j]["ing_yn"] == "Y") {
          this.productList[i]["works"][j]["back_color"] = "#00CC00";
        }

        //외주일때는 점선

        if (this.productList[i]["works"][j]["outsourcing_yn"] == "Y") {
          this.productList[i]["works"][j]["dashed"] = "2px dashed";
        }

        //불량일때는 붉은색
        if (this.productList[i]["works"][j]["error_yn"] == "Y") {
          this.productList[i]["works"][j]["back_color"] = "orangered";
        }


        //재계산-로직(추후 확정일때는 해당 로직 삭제)
        this.productList[i]["works"][j]["plan_price"] = this.comma(this.productList[i]["works"][j]["std_num"] * this.productList[i]["works"][j]["plan_st"]);
        //console.log(this.comma(this.productList[i]["works"][j]["std_num"] * this.productList[i]["works"][j]["plan_st"]));
        let plan_price = this.uncomma(this.productList[i]["works"][j]["plan_price"]);
        sub_sum += plan_price;

        //상단 총 합계를 구해주기 위함
        let work_nm = this.productList[i]["works"][j]["work_nm"];
        tot_sum[work_nm] = (tot_sum[work_nm] || 0) + plan_price;
        tot_sum_class[work_nm] = this.productList[i]["works"][j]["class"];
      }
      this.productList[i]["sub_sum"] = this.comma(sub_sum);
    }

    this.sumList = [];
    this.info_sum = 0;
    for (let id in tot_sum) {
      this.sumList.push({ id: id, value: this.comma(tot_sum[id]), class: tot_sum_class[id] })
      this.info_sum += tot_sum[id];
    }
    this.info_sum = this.comma(this.info_sum);
    //정렬
    this.productList.sort((a, b) => a["sort_num"] > b["sort_num"] ? 1 : a["sort_num"] === b["sort_num"] ? 0 : -1);
  }

  comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  uncomma(str) {
    return Number(str.replace(/\,/gi, ""));
  }

  save_st() {
    //ST, 제조가격 저장
    let input_sts = document.getElementsByName("text_st");
    for (let i = 0; i < input_sts.length; i++) {
      let param = [{
        emp_no: this.user.empId
        , product_id: input_sts[i]["id"].split("_")[1]
        , product_work_id: input_sts[i]["id"].split("_")[2]
        , plan_st: this.uncomma((input_sts[i]["value"] || "0"))
        , plan_price: this.uncomma((document.getElementById(input_sts[i]["id"].replace("st", "price"))["value"] || "0"))
        , plan_rt: this.uncomma((document.getElementById(input_sts[i]["id"].replace("st", "im"))["value"] || "0"))
      }];
      this.pmsApiService.fetch('productwork/work_plan_st', param, "put").subscribe(result => {
        if (result.code == "00") {

        } else {
          alert("오류 등록");
        }
      })
    }
  }

  filedown_map(product) {
    let param = [{ product_id: product.product_id }];
    this.pmsApiService.fetch('orderlist/map_file_search', param).subscribe(result => {
      if (result.code == "00") {
        if (result.data.length > 0) {
          for (let i = 0; i < result.data.length; i++) {
            setTimeout(() => {
              this.filedown(result.data[i]);
            }, (i * 2000));
          }
        } else {
          this.notificationService.smallBox({
            title: "등록된 도면이 없습니다.",
            content: "수주정보에서 도면을 등록하세요.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
        }

      } else {
        alert("오류 등록");
      }
    })
  }

  filedown(file) {
    const url = this.getBaseUrl() + "filedown_one";
    const dataURI = "data:multipart/form-data;";

    //기본경로 + 특수문자(＾) + 오리지널 파일명
    const file_nm =
      file.COMPANY_CD + "//" + file.ATTACH_TP + "//" + file.RGST_ID + "//" +
      file.FILE_SAVE_NM.toString().substring("0", "1") + "//" +
      file.FILE_SAVE_NM.toString().substring("1", "2") + "//" +
      file.FILE_SAVE_NM.toString().substring("2", "3") + "//" +
      file.FILE_SAVE_NM.toString() + "＾" +
      file.FILE_NM;

    saveAs(dataURI, file_nm, {
      forceProxy: true,
      proxyURL: url,
      proxyData: {
        '__RequestVerificationToken': 'xyz'
      }
    });
  }
  private getBaseUrl() {
    return pmsConfig.Protocol + '://' + pmsConfig.Hostname + (pmsConfig.Port ? ':' + pmsConfig.Port : '') + '/'
  }

  //공정계획수립------------------end-----------------------------



  //계획작성------------------start-----------------------------
  items_save_key = 0;
  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  disabledIndexes = [];

  plan_pop(product) {
    this.items_save = [];
    this.disabledIndexes = [];
    this.work_del_ids = "0"
    //this.commoncodeList();
    //선택된 내용 추가


    for (let i = 0; i < product.works.length; i++) {
      this.items_save_key = i;
      for (let j = 0; j < this.items_default.length; j++) {
        if (this.items_default[j]["SUB_CD"] == product.works[i]["work_cd"]) {
          if (product.works[i]["del_yn"] == "N") {
            this.disabledIndexes.push(this.items_save_key);
          }
          this.items_save.push({
            WORK_ID: product.works[i]["product_work_id"],
            SUB_CD: product.works[i]["work_cd"], SUB_NM: product.works[i]["work_nm"],
            color: this.items_default[j]["color"], key: this.items_save_key,
            DEL_YN: product.works[i]["del_yn"]
          });
          break;
        }
      }
    }

    this.delItems();
    this.product = product;
    this.lgModal_add.show();
  }

  delItems() {
    //선택된 내용을 표준에서 삭제
    //아래 주석 : 옴긴후에 데이터 삭제 안함
    // setTimeout(() => {
    //   for (let i = 0; i < this.items_save.length; i++) {
    //     this.commoncodelist.forEach((item, index) => {
    //       if (item.SUB_CD === this.items_save[i].SUB_CD) {
    //         this.commoncodelist.splice(index, 1);
    //       }
    //     });
    //   }
    //   this.items_default = this.commoncodelist;
    // }, 200);
  }

  item_down(items) {
    this.items_save_key += 1;
    this.items_save.push({ SUB_CD: items.SUB_CD, SUB_NM: items.SUB_NM, color: items.color, key: this.items_save_key });
    this.delItems();
  }

  item_up(items) {
    //아래 주석 : 옴긴후에 데이터 삭제 안함
    //this.items_default.push({ SUB_CD: items.SUB_CD, SUB_NM: items.SUB_NM });

    if (items.DEL_YN == "N") {
      this.notificationService.smallBox({
        title: "삭제할 수 없습니다.",
        content: "진행 or 확정된 공정입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
    } else {
      this.items_save.forEach((item, index) => {
        if (item.key === items.key) {
          this.work_del_ids += "," + (items.WORK_ID || "0");
          this.items_save.splice(index, 1);
        }
      });
    }
  }

  getColor(color) {
    switch (color) {
      case 'yellow':
        return '#b09b5b';
      case 'red':
        return '#a90329';
      case 'green':
        return '#356e35';
    }
  }

  //저장 및 삭제
  save_item() {
    //삭제
    let param_del = [{ product_work_ids: this.work_del_ids }];
    this.pmsApiService.fetch('productwork/work_plan_del', param_del, "put").subscribe(result_del => {
      if (result_del.code == "00") {
        //추가
        if (this.items_save.length > 0) {
          for (let i = 0; i < this.items_save.length; i++) {
            let param = [{
              emp_no: this.user.empId
              , product_id: this.product["product_id"]
              , product_work_id: (this.items_save[i]["WORK_ID"] || "0")
              , work_cd: (this.items_save[i]["SUB_CD"] || "")
              , sort_num: (i + 1)
            }];
            this.pmsApiService.fetch('productwork/work_plan', param, "put").subscribe(result => {
              if (result.code == "00") {
                if ((i + 1) == this.items_save.length) {
                  setTimeout(() => {
                    //this.commoncodeList();
                    this.searchData();
                    this.lgModal_add.hide();
                    //lock 여부 체크하여 락 풀어주기(락은 작업관리에서 이루어 지고 여기서 풀어줌)
                    this.pmsApiService.fetch('productwork/lock_update', param, "put").subscribe(result => {})
                  }, 200);
                }
              } else {
                alert("오류 등록");
              }
            })
          }
        } else {
          setTimeout(() => {
            //this.commoncodeList();
            this.searchData();
            this.lgModal_add.hide();
          }, 200);
        }
      } else {
        alert("오류 삭제");
      }
    })
  }
  //계획작성------------------end-----------------------------


  //작업관리팝업 상세정보 ------------------start-----------------------------
  @Input() PRODUCT_WORK_ID: string;
  @ViewChild('lgModal_pop_product_work_view') public lgModal_pop_product_work_view: ModalDirective;
  work_reg(product_work) {
    this.PRODUCT_WORK_ID = product_work.product_work_id;
    this.lgModal_pop_product_work_view.show();
  }
  close_lgModal_work_view() {
    this.commoncodeList();
    this.searchData();
    this.lgModal_pop_product_work_view.hide();
  }

  //작업관리팝업 상세정보 ------------------end-----------------------------


  //사용안함
  public onDataRemove(src: number, e: DataEvent): void {
    this.commoncodeList();
  }




  //별도임률------------------start-----------------------------
  @ViewChild('lgModal_im') public lgModal_im: ModalDirective;
  open_lgModal_im() {
    //임시저장 호출
    this.save_st();

    let param = [{
      order_id: this.order_id
    }];
    this.pmsApiService.fetch('productwork/order_rate', param).subscribe(result => {
      if (result.code == "00") {
        this.def_rt_list = result.data;
      }
    });

    this.lgModal_im.show();
  }
  save_im() {
    //표준임률 저장
    if (this.def_rt_disabled == false) {
      let input_def = document.getElementsByName("add_def_rt");
      for (let i = 0; i < input_def.length; i++) {
        if ((input_def[i]["value"] || "0") != "0") {
          let param_def = [{
            emp_no: this.user.empId
            , work_cd: input_def[i]["id"].replace("add_def_rt_", ""), rate: input_def[i]["value"]
          }];
          this.pmsApiService.fetch('productwork/order_rate_commomcode', param_def, "put").subscribe(result => {
            if (result.code == "00") {

            }
          })
        }
      }
    }

    //별도임률 등록
    let param_del = [{ emp_no: this.user.empId, order_id: this.order_id }];
    this.pmsApiService.fetch('productwork/order_rate_del', param_del, "put").subscribe(result_del => {
      if (result_del.code == "00") {
        let input_ims = document.getElementsByName("add_order_rt");
        for (let i = 0; i < input_ims.length; i++) {
          if ((input_ims[i]["value"] || "0") != "0") {
            let param = [{
              emp_no: this.user.empId, order_id: this.order_id
              , work_cd: input_ims[i]["id"].replace("add_order_rt_", ""), rate: input_ims[i]["value"]
            }];
            this.pmsApiService.fetch('productwork/order_rate', param, "put").subscribe(result => {
              if (result.code == "00") {
                if ((i + 1) == input_ims.length) {
                  //this.commoncodeList();
                  this.searchData();
                  this.lgModal_im.hide();
                }
              } else {
                alert("오류 등록");
              }
            })
          } else {
            if ((i + 1) == input_ims.length) {
              //this.commoncodeList();
              this.searchData();
              this.lgModal_im.hide();
            }
          }
        }
      } else {
        alert("오류 삭제");
      }
    })
  }
  //별도임률------------------end-----------------------------


  //계획복사------------------start-----------------------------
  @ViewChild('lgModal_copy') public lgModal_copy: ModalDirective;
  copy_product_id;
  copy_pop(product) {
    this.copy_product_id = (product.product_id);
    this.lgModal_copy.show();
  }

  copy_colse() {
    this.copy_product_id = null;
    this.lgModal_copy.hide();
  }
  //계획복사------------------end-----------------------------


  //엑셀템플릿 다운로드(작업공정표)
  excel_templete_download1(product) {
    const baseUrl = pmsConfig.Protocol + '://' + pmsConfig.Hostname + (pmsConfig.Port ? ':' + pmsConfig.Port : '') + '/';
    const url = baseUrl + "templete_down_1";
    const dataURI = "data:multipart/form-data;";

    //프로덕트ID
    const file_nm = product.product_id;

    saveAs(dataURI, file_nm, {
      forceProxy: true,
      proxyURL: url,
      proxyData: {
        '__RequestVerificationToken': 'xyz'
      }
    });
  }

  //엑셀템플릿 다운로드(소재원가)
  excel_templete_download2() {
    const baseUrl = pmsConfig.Protocol + '://' + pmsConfig.Hostname + (pmsConfig.Port ? ':' + pmsConfig.Port : '') + '/';
    const url = baseUrl + "templete_down_2";
    const dataURI = "data:multipart/form-data;";

    //프로덕트ID
    const file_nm = this.order_id;

    saveAs(dataURI, file_nm, {
      forceProxy: true,
      proxyURL: url,
      proxyData: {
        '__RequestVerificationToken': 'xyz'
      }
    });
  }

}
