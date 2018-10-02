import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../core/api/pms-api.service";

import { NotificationService } from "../../shared/utils/notification.service";
declare var $: JQueryStatic;
import 'jqueryui';

import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { pmsConfig } from '../../shared/pms.config';


@Component({
  selector: 'app-dashboard05',
  templateUrl: './dashboard05.component.html'
})
export class Dashboard05Component implements OnInit {
  @Input() order_id: string;
  @Output() modal_close = new EventEmitter(); //모달 닫기

  closePop() {
    this.modal_close.emit('');
  }

  constructor(
    private pmsApiService: PmsApiService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {}

  ngOnChanges() {}

  productList: any[] = [];
  code_sum = [];
  sumList = [];
  info_sum = 0;

  searchData() {
    if (this.order_id == undefined) return;
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
      let sub_sum_st = 0;
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

        //뷰노출이 y가 아닐때 보더 빨강
        //외주일때 점선
        if (this.productList[i]["works"][j]["view_yn"] != "Y") {
          if (this.productList[i]["works"][j]["outsourcing_yn"] == "Y") {
            this.productList[i]["works"][j]["dashed"] = "2px dashed blue";
          } else {
            this.productList[i]["works"][j]["dashed"] = "2px solid blue";
          }
        } else {
          if (this.productList[i]["works"][j]["outsourcing_yn"] == "Y") {
            this.productList[i]["works"][j]["dashed"] = "2px dashed";
          }
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
        sub_sum_st += Number(plan_st);

        //상단 총 합계를 구해주기 위함
        let work_nm = this.productList[i]["works"][j]["work_nm"];
        tot_sum[work_nm] = (tot_sum[work_nm] || 0) + plan_price;
        tot_sum_class[work_nm] = this.productList[i]["works"][j]["class"];
      }
      this.productList[i]["sub_sum"] = this.comma(sub_sum);
      this.productList[i]["sub_sum_st"] = this.comma(sub_sum_st.toFixed(1));
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

  //수주선택 모달--------------start
  Modal_OrderNo;
  @ViewChild('Modal_order') public Modal_order:ModalDirective;
  Modal_order_Return(event){
    this.Modal_order.hide();
    //넘어오는값은 수주ID, 수주번호
    this.order_id = event.split("＆")[0];
    this.Modal_OrderNo = event.split("＆")[1];

    //여기는 해당 화면마다 옵션
    this.searchData();
  }
  //수주선택 모달--------------end

}
