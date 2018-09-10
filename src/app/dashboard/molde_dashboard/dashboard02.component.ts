import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../core/api/pms-api.service";


declare var $: JQueryStatic;
import 'jqueryui';

@Component({
  selector: 'app-dashboard02',
  templateUrl: './dashboard02.component.html'
})
export class Dashboard02Component implements OnInit {
  @Input() order_id: string;
  @Output() modal_close = new EventEmitter(); //모달 닫기

  closePop() {
    this.modal_close.emit('');
  }

  constructor(
    private pmsApiService: PmsApiService
  ) {
  }

  ngOnInit() {}

  ngOnChanges() {}

  productList: any[] = [];
  totList: any[] = [];
  searchData() {
    if (this.order_id == undefined) return;

    this.productList = [];

    let param = [{
      order_id: this.order_id
    }];
    //합계
    this.pmsApiService.fetch('mdlde_dashboard/dashboard02_tot_list', param).subscribe(result => {
      if (result.code == "00") {
        this.totList = result.data.sort((a, b) => a["ORD_NO"] > b["ORD_NO"] ? 1 : a["ORD_NO"] === b["ORD_NO"] ? 0 : -1);
      } else {
        alert("오류 등록");
      }
    });

    //본문정보
    this.pmsApiService.fetch('orderlist/product_search', param).subscribe(result => {
      if (result.code == "00") {

        for (let i = 0; i < result.data.length; i++) {
          let param_sub = [{ order_id: this.order_id, product_id: result.data[i]["product_id"] }];
          this.pmsApiService.fetch('mdlde_dashboard/dashboard02_work_list', param_sub).subscribe(result_sub => {
            if (result_sub.code == "00") {

              //정렬
              result_sub.data.sort((a, b) => a["sort_num"] > b["sort_num"] ? 1 : a["sort_num"] === b["sort_num"] ? 0 : -1);
              this.productList.push({
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
                  this.productList.sort((a, b) => a["sort_num"] > b["sort_num"] ? 1 : a["sort_num"] === b["sort_num"] ? 0 : -1);
                  this.html_main();
                }, 400);
              }
            }
          });
        }
      } else {
        alert("오류 등록");
      }
    });
  }

  html_main() {
    let html = "";
    for (let i = 0; i < this.productList.length; i++) {
      html += `<table class="table table-bordered" style="width:unset; max-width:unset;">
        <tr>
          <th rowspan="4" style="border-right-width:1px;background-color:#eee;width:80px;min-width:80px;max-width:80px;vertical-align:middle;text-align:center;">
          ` + this.productList[i]["map_no"] + `
          </th>
          <th rowspan="4" style="border-right-width:1px;background-color:#eee;width:140px;min-width:140px;max-width:140px;vertical-align:middle;text-align:left;font-size:12px;">
          품번&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ` + this.productList[i]["product_no"] + ` <br />
          품명&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ` + this.productList[i]["product_nm"] + ` <br />
          수량&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ` + this.productList[i]["volume"] + ` <br />
          사이즈&nbsp;: ` + this.productList[i]["size"] + `
          </th>
        </tr> `
        + this.html_body(this.productList[i]["works"]);
      +  `</table>`;
    }
    $("#html_main").html(html);

    //합계테이블 : 위 구하는게 거의 비슷(하나로 합치기도 생각하면 가능할듯)
    this.html_tot();
  }

  html_body(works) {
    let html = "";
    let html_head = "";
    let html_time = "";
    let html_price = "";
    let html_td_style = "width:70px;min-width:70px;max-width:70px;text-align:right;";

    let tot_st = 0;
    let tot_wt = 0;
    let tot_st_money = 0;
    let tot_wt_money = 0;

    for (let i = 0; i < works.length; i++) {
      tot_st += Number(works[i]["PLAN_ST"]);
      tot_wt += Number(this.wt_sum(works[i], "wt"));
      tot_st_money += Number(works[i]["PLAN_PRICE"]);
      tot_wt_money += Number(this.wt_sum(works[i], "money"));

      html_head += `
      <th colspan="2" style="background-color:#eee;text-align:center;">
        ` + works[i]["WORK_NM"] + `
      </th>`;


      html_time += `
      <td style="`+ html_td_style + `">
      ` + this.comma(Number(works[i]["PLAN_ST"]).toFixed(1)) + `
      </td>
      <td style="background-color:#f9f2f4;`+ html_td_style + `">
      ` + this.comma(Number(this.wt_sum(works[i], "wt")).toFixed(1)) + `
      </td>`;

      html_price += `
      <td style="`+ html_td_style + `">
      ` + this.comma(works[i]["PLAN_PRICE"]) + `
      </td>
      <td style="background-color:#f9f2f4;`+ html_td_style + `">
      ` + this.comma(this.wt_sum(works[i], "money")) + `
      </td>`;
    }

    html += `
      <tr>
        <th colspan="2" style="border-right-width:1px;background-color:#eee;text-align:center;">
          ` + "부품별 합계" + `
        </th>
      ` + html_head+`
      </tr>
      <tr>
        <td style="font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_st).toFixed(1)) + `
        </td>
        <td style="background-color:#f9f2f4;font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_wt).toFixed(1)) + `
        </td>`
        + html_time + `
      </tr>
      <tr>
        <td style="font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_st_money)) + `
        </td>
        <td style="background-color:#f9f2f4;font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_wt_money)) + `
        </td>`
        + html_price + `
      </tr>
    `;


    return html;
  }

  wt_sum(work, tp) {
    let wt = 0;
    let chk_set = <HTMLInputElement>document.getElementById("chk_set");
    let chk_human = <HTMLInputElement>document.getElementById("chk_human");
    let chk_auto = <HTMLInputElement>document.getElementById("chk_auto");
    let chk_no = <HTMLInputElement>document.getElementById("chk_no");

    if (chk_set.checked == true) wt += Number(work["SET_H"]);
    if (chk_human.checked == true) wt += Number(work["HUMAN_H"]);
    if (chk_auto.checked == true) wt += Number(work["AUTO_H"]);
    if (chk_no.checked == true) wt += Number(work["NO_H"]);

    let ret;

    //외주비용은 항상 더한다
    //쿼리에서 외주비용일때는 WT를 다 0으로 셋팅 - 즉 마지막에는 외주비용을 더해준다.
    if (tp == "money") ret =  (Number(wt * work["PLAN_RT"]) + Number(work["OUTSOURCING_AMT"])).toFixed(0);
    else ret = wt.toFixed(1);

    return ret;
  }










  html_tot() {
    let html = "";
    let html_head = "";
    let html_time = "";
    let html_price = "";
    let html_td_style = "width:70px;min-width:70px;max-width:70px;text-align:right;";

    let tot_st = 0;
    let tot_wt = 0;
    let tot_st_money = 0;
    let tot_wt_money = 0;
    for (let i = 0; i < this.totList.length; i++) {
      tot_st += Number(this.totList[i]["PLAN_ST"]);
      tot_wt += Number(this.wt_sum(this.totList[i], "wt"));
      tot_st_money += Number(this.totList[i]["PLAN_PRICE"]);
      tot_wt_money += Number(this.wt_sum(this.totList[i], "money"));

      html_head += `
        <th colspan="2" style="border-right-width:1px;background-color:#eee;vertical-align:middle;text-align:center;">
          ` + this.totList[i]["WORK_NM"] + `
        </th> `;

      html_time += `
        <td style="`+ html_td_style + `">
        ` + this.comma(Number(this.totList[i]["PLAN_ST"]).toFixed(1)) + `
        </td>
        <td style="background-color:#f9f2f4;`+ html_td_style + `">
        ` + this.comma(Number(this.wt_sum(this.totList[i], "wt")).toFixed(1)) + `
        </td>`;

      html_price += `
        <td style="`+ html_td_style + `">
        ` + this.comma(this.totList[i]["PLAN_PRICE"]) + `
        </td>
        <td style="background-color:#f9f2f4;`+ html_td_style + `">
        ` + this.comma(this.wt_sum(this.totList[i], "money")) + `
        </td>`;
    }

    html += `
    <table class="table table-bordered" style="width:unset; max-width:unset;">
      <tr>
        <th colspan="2" style="border-right-width:1px;background-color:#eee;vertical-align:middle;text-align:center;">
          ` + "총액" + `
        </th> `
        + html_head + `
      </tr>
      <tr>
        <td style="font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_st).toFixed(1)) + `
        </td>
        <td style="background-color:#f9f2f4;font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_wt).toFixed(1)) + `
        </td>`
        + html_time + `
      </tr>
      <tr>
        <td style="font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_st_money)) + `
        </td>
        <td style="background-color:#f9f2f4;font-weight:bold;`+ html_td_style + `">
        ` + this.comma(Number(tot_wt_money)) + `
        </td>`
        + html_price + `
      </tr>
    </table>`;
    $("#html_tot").html(html);
  }


  comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
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
  //수주선택

}
