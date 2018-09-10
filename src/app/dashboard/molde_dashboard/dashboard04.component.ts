import { Component, OnInit, ViewChild, Input, Output, ElementRef } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../core/api/pms-api.service";
import { NotificationService } from "../../shared/utils/notification.service";

declare var $: JQueryStatic;
import 'jqueryui';

declare function unescape(s: string): string;
declare function escape(s: string): string;

@Component({
  selector: 'app-dashboard04',
  templateUrl: './dashboard04.component.html'
})
export class Dashboard04Component implements OnInit {
  @ViewChild('st_dt_fr') st_dt_fr: ElementRef;
  @ViewChild('st_dt_to') st_dt_to: ElementRef;
  sc_work_cd;
  arr_work_list;
  constructor(
    private pmsApiService: PmsApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    //공정리스트
    let param = [{
      main_cd: "BS00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.arr_work_list = result.data;
    });

    this.st_dt_fr.nativeElement.value = new Date().toISOString().substr(0, 4).replace('T', ' ') + "-01-01";
    this.st_dt_to.nativeElement.value = new Date().toISOString().substr(0, 10).replace('T', ' ');

  }
  ngOnChanges() { }


  searchCheck(): Boolean {
    let ret = true;
    if ((this.sc_work_cd || "") == "") {
      this.notificationService.smallBox({
        title: "공정를 선택하세요.",
        content: "조회할 공정를 선택하신후 조회를 하시기 바랍니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false;


    } else if ((this.st_dt_fr.nativeElement.value || "") == "") {
      this.notificationService.smallBox({
        title: "기간을 선택하세요.",
        content: "시작일자를 선택하세요.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false;
    } else if ((this.st_dt_to.nativeElement.value || "") == "") {
      this.notificationService.smallBox({
        title: "기간을 선택하세요.",
        content: "종료일자를 선택하세요.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false;
    }


    return ret;
  }
  searchData() {
    if (this.searchCheck() == false) return;


    //담당자별, 공정별 조회는 같은 쿼리를 사용한다.
    let param = [{
      //담당자별 공정조회(dashboard03 전용)
      emp_no: "",

      //공정별 공정조회(dashboard04 전용)
      work_cd: this.sc_work_cd,

      //공통
      dt_fr: this.st_dt_fr.nativeElement.value,
      dt_to: this.st_dt_to.nativeElement.value
     }];

    this.pmsApiService.fetch('mdlde_dashboard/dashboard03_04_list', param).subscribe(result => {
      if (result.code == "00") {
        if (result.data.length == 0) {
          this.notificationService.smallBox({
            title: "데이터가 없습니다.",
            content: "다른 공정을 선택하세요.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
        } else {
          this.body_html(result.data);
        }

      } else {
        alert("오류");
      }
    });
  }




  body_html(data) {
    let html = "";
    let wt_1 = 0;
    let wt_2 = 0;
    let wt_3 = 0;
    let wt_4 = 0;
    let wt = 0;
    let st = 0;

    let tot_wt_1 = 0;
    let tot_wt_2 = 0;
    let tot_wt_3 = 0;
    let tot_wt_4 = 0;
    let tot_wt = 0;
    let tot_st = 0;

    for (let i = 0; i < data.length; i++) {
      wt_1 += data[i].WT_1;
      wt_2 += data[i].WT_2;
      wt_3 += data[i].WT_3;
      wt_4 += data[i].WT_4;
      wt += data[i].WT;
      st += data[i].ST;

      tot_wt_1 += data[i].WT_1;
      tot_wt_2 += data[i].WT_2;
      tot_wt_3 += data[i].WT_3;
      tot_wt_4 += data[i].WT_4;
      tot_wt += data[i].WT;
      tot_st += data[i].ST;

      html += `
        <tr>
          <td style='text-align:center;vertical-align:middle;'>
          ` + data[i].EMP_NM + `
          </td>
          <td style='text-align:center;vertical-align:middle;'>
          ` + data[i].ORDER_NO + `
          </td>
          <td style='text-align:center;vertical-align:middle;'>
          ` + data[i].PRODUCT_NO + `
          </td>
          <td style='text-align:center;vertical-align:middle;'>
          ` + data[i].PRODUCT_NM + `
          </td>
          <td style='text-align:right;vertical-align:middle;'>
          ` + data[i].VOLUME + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].ST + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].WT + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].WT_1 + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].WT_2 + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].WT_3 + `
          </td>
          <td style='text-align:right;vertical-align:right;'>
          ` + data[i].WT_4 + `
          </td>
        </tr>
      `;

      //맨 마지막일때 소계, 합계
      if (i == (data.length - 1)) {
        //소계
        html += this.product_sub_sum("SUB", wt_1, wt_2, wt_3, wt_4, wt, st, data[i].EMP_NM);

        //합계
        html += this.product_sub_sum("MAIN", tot_wt_1, tot_wt_2, tot_wt_3, tot_wt_4, tot_wt, tot_st, "전체");

        wt_1 = 0;
        wt_2 = 0;
        wt_3 = 0;
        wt_4 = 0;
        wt = 0;
        st = 0;
        //내꺼와 아래꺼의 데이터가 틀릴경우 합계
      } else if (data[i].EMP_NO != data[(i + 1)].EMP_NO) {
        //소계
        html += this.product_sub_sum("SUB", wt_1, wt_2, wt_3, wt_4, wt, st, data[i].EMP_NM);
        wt_1 = 0;
        wt_2 = 0;
        wt_3 = 0;
        wt_4 = 0;
        wt = 0;
        st = 0;
      }

    }

    $("#tbody_list").html(html);
  }

  product_sub_sum(tr_tp, wt_1, wt_2, wt_3, wt_4, wt, st, title) {
    title = title + " 합계";
    //if (tr_tp == "MAIN") title = "전체 합계";
    return `
      <tr style="background-color:#f9f2f4;font-weight:bold;">
        <td colspan="5" style='text-align:center;vertical-align:middle;'>
          ` + title + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + st + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + wt + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + wt_1 + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + wt_2 + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + wt_3 + `
        </td>
        <td style='text-align:right;vertical-align:right;'>
        ` + wt_4 + `
        </td>
      </tr>
    `;
  }

  tableToExcel(table) {
    let uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>{table}</html>'
      //, base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
      , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    if (!table.nodeType) table = document.getElementById(table)
    //엑셀다운로드시 데이터 수정
    let export_excel = table.innerHTML;
    export_excel = export_excel.replace(/background-color:#eee;/g, "");
    export_excel = export_excel.replace(/class="table table-bordered"/g, "border='1'");
    export_excel = export_excel.replace(/background-color:#f9f2f4;/g, "");

    var ctx = { worksheet: name || 'Worksheet', table: export_excel }
    //window.location.href = uri + base64(format(template, ctx))
    var link = document.createElement('a');
    link.download = "공정별 공정내역";
    link.href = uri + base64(format(template, ctx));
    link.click();
  }

}
