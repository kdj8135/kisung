import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../core/api/pms-api.service";

declare var $: JQueryStatic;
import 'jqueryui';

declare function unescape(s: string): string;
declare function escape(s: string): string;


@Component({
  selector: 'app-dashboard01',
  templateUrl: './dashboard01.component.html',
  //styleUrls: ['./productplan.component.css'],
})
export class Dashboard01Component implements OnInit {
  order_id;
  order_rt = 80;
  order_rt_math = 0;
  constructor(
    private pmsApiService: PmsApiService
  ) {
  }

  ngOnInit() {}

  ngOnChanges() {}

  private Data_Load() {


    if ((this.order_id == undefined || 0)) return;

    let param = [{order_id: this.order_id}];
    this.pmsApiService.fetch('mdlde_dashboard/dashboard01_list', param).subscribe(result => {
      if (result.code == "00") {
        this.body_html(result.data);
      } else {
        alert("오류");
      }
    });

    this.excel_html();
  }

  body_html(data) {
    let html = "";
    if (data.length == 0) {
      html = `
        <tr>
          <td colspan='6' style='text-align:center;'>데이터가 없습니다.</td>
        </tr>
      `;
    } else {
      let sum_st = 0;
      let sum_rt = 0;
      let sum_price = 0;
      for (let i = 0; i < data.length; i++) {
        sum_st += Number(data[i].PLAN_ST);
        sum_rt += Number(data[i].PLAN_RT);
        sum_price += Number(data[i].PLAN_PRICE);
        //본문
        html += `
          <tr>
            <td style='text-align:center;vertical-align:middle;'>
            ` + (i + 1) +`
            </td>
            <td style='text-align:center;vertical-align:middle;'>
            ` + data[i].WORK_NM +`
            </td>
            <td style='text-align:center;vertical-align:middle;'>
            ` + data[i].SUB_NM +`
            </td>
            <td style='text-align:right;vertical-align:middle;'>
            ` + this.comma(data[i].PLAN_ST) +`
            </td>
            <td style='text-align:right;vertical-align:middle;'>
            ` + this.comma(data[i].PLAN_RT) +`
            </td>
            <td style='text-align:right;vertical-align:middle;'>
            ` + this.comma(data[i].PLAN_PRICE) +`
            </td>
          </tr>
        `;
      }
      //합계
      html += `
        <tr>
          <td colspan='3' style='text-align:center;vertical-align:middle;font-weight:bold;'>
          ` + "합계" +`
          </td>
          <td style='text-align:right;vertical-align:middle;font-weight:bold;'>
          ` + this.comma(sum_st.toFixed(1)) +`
          </td>
          <td style='text-align:right;vertical-align:middle;font-weight:bold;'>
          ` + this.comma(sum_rt) +`
          </td>
          <td style='text-align:right;vertical-align:middle;font-weight:bold;'>
          ` + this.comma(sum_price) +`
          </td>
        </tr>
      `;

    }
    $("#tbody_list").html(html);
  }

  comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }



    //수주가
    info_price = 0;
    excel_html() {
      this.order_rt_math = (this.order_rt /100);

      let param = [{order_id: this.order_id}];
      this.pmsApiService.fetch('mdlde_dashboard/dashboard01_excel', param).subscribe(result => {
        this.info_price = Number(result.data_info[0].price);
        //상단 탑 테이블
        this.html_top(result);
        //본문
        this.html_detail(result);
        //하단
        this.html_foot(result);
      });
    }

    html_top(result) {
      let html = "";
      let html_head1 = "";
      let html_head2 = "";
      let html_im_rt = "";
      let html_st = "";
      let html_st_p = "";
      let html_wt = "";
      let html_wt_p = "";


      let tot_st = 0;
      let tot_st_p = 0;
      let tot_wt = 0;
      let tot_wt_p = 0;
      for (let i = 0; i < result.data.length; i++) {
        //합계구하기
        tot_st += Number(result.data[i]["ST"]);
        tot_st_p += Number(result.data[i]["ST_P"]);
        tot_wt += Number(result.data[i]["WT"]);
        tot_wt_p += Number(result.data[i]["WT_P"]);

        //제목그리기
        if (i == 0) {
          html_head1 += `<th style="text-align:center;" rowspan="2">공정</th> `;
          html_im_rt += `<th style="text-align:center;">임율</th> `;
          html_st += `   <th style="text-align:center;">ST</th> `;
          html_st_p += ` <th style="text-align:center;">ST금액</th> `;
          html_wt += `   <th style="text-align:center;">WT</th> `;
          html_wt_p += ` <th style="text-align:center;">WT금액</th>`;
        }
        //본문그리기
        html_head1 += `<th style="text-align:center;">` + result.data[i]["WORK_NM"] + `</th> `;
        html_head2 += `<th style="text-align:center;">` + result.data[i]["SUB_NM"] + `</th> `;
        html_im_rt += `<td style="text-align:right;">` + this.comma(result.data[i]["PLAN_RT"]) + `</td> `;
        html_st += `<td style="text-align:right;">` + this.comma(result.data[i]["ST"]) + `</td> `;
        html_st_p += `<td style="text-align:right;">` + this.comma(result.data[i]["ST_P"]) + `</td> `;
        html_wt += `<td style="text-align:right;">` + this.comma(result.data[i]["WT"]) + `</td> `;
        html_wt_p += `<td style="text-align:right;">` + this.comma(result.data[i]["WT_P"]) + `</td> `;
        //합계그리기
        if (i == (result.data.length - 1)) {
          html_head1 += `<th style="text-align:center;" rowspan="2" colspan="2">합 계</th> `;
          html_im_rt += `<th style="text-align:center;" colspan="2"></th> `;
          html_st += `   <th style="text-align:right;" colspan="2">` + this.comma(tot_st.toFixed(1)) + `</th> `;
          html_st_p += ` <th style="text-align:right;" colspan="2">` + this.comma(tot_st_p.toFixed(0)) + `</th> `;
          html_wt += `   <th style="text-align:right;" colspan="2">` + this.comma(tot_wt.toFixed(1)) + `</th> `;
          html_wt_p += ` <th style="text-align:right;" colspan="2">` + this.comma(tot_wt_p.toFixed(0)) + `</th> `;
        }
      }

      //최종결과물
      html += `
        <table border="1" class="table table-bordered">
          <tr><th style="text-align:center;" colspan="`+(result.data.length + 3)+`">BOM 산출내역</th></tr>
          <tr>`+ html_head1 + `</tr>
          <tr>`+ html_head2 + `</tr>
          <tr>`+ html_im_rt + `</tr>
          <tr>`+ html_st + `</tr>
          <tr>`+ html_st_p + `</tr>
          <tr>`+ html_wt + `</tr>
          <tr>`+ html_wt_p + `</tr>
        </table>
      `;
      $("#html_work").html(html);
    }




    //사내설계비
    Num_06_ST_P = 0;
    Num_06_WT_P = 0;
    //사내설계비
    Num_07_ST_P = 0;
    Num_07_WT_P = 0;
    //소재비
    Num_04_ST_P = 0;
    Num_04_WT_P = 0;
    //면삭비
    Num_05_ST_P = 0;
    Num_05_WT_P = 0;
    //구매품
    Num_03_ST_P = 0;
    Num_03_WT_P = 0;
    //외주가공비
    Num_02_ST_P = 0;
    Num_02_WT_P = 0;
    //사내가공비
    Num_01_ST_P = 0;
    Num_01_WT_P = 0;
    //조립비
    Num_08_ST_P = 0;
    Num_08_WT_P = 0;

    //합계 : 비율의 합계 -- 소수점을 더해서 사용해야 하기 때문에 따로 분리
    detail_sum_rt : number = 0;
    html_detail(result) {
      //테이블 컬럼 합치기 확인
      let colspan = 0;
      if (colspan < result.data_0001.length) colspan = result.data_0001.length;
      if (colspan < result.data_0002.length) colspan = result.data_0002.length;
      if (colspan < result.data_0003.length) colspan = result.data_0003.length;
      if (colspan < result.data_0004.length) colspan = result.data_0004.length;
      if (colspan < result.data_0005.length) colspan = result.data_0005.length;
      if (colspan < result.data_0006_7.length) colspan = result.data_0006_7.length;
      if (colspan < result.data_0008.length) colspan = result.data_0008.length;



      //설계비-------------------------start------------------------
      let html_06_07_title = "";
      let html_06_07_title_sub = "";
      let html_06_07_ST = "";
      let html_06_07_WT = "";

      //사내
      this.Num_06_ST_P = 0;
      this.Num_06_WT_P = 0;
      //외주
      this.Num_07_ST_P = 0;
      this.Num_07_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_06_07_ST = `<td style="text-align:center;">계획</td>`;
          html_06_07_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          if (result.data_0006_7[i]["CD"] == "사내") {
            this.Num_06_ST_P += Number(result.data_0006_7[i]["ST_P"])
            this.Num_06_WT_P += Number(result.data_0006_7[i]["WT_P"]);
          } else {
            this.Num_07_ST_P += Number(result.data_0006_7[i]["ST_P"])
            this.Num_07_WT_P += Number(result.data_0006_7[i]["WT_P"]);
          }

          html_06_07_title_sub += `<td style="text-align:center;">` + (result.data_0006_7[i]["NM"] || "") + `</td>`;
          html_06_07_ST += `<td style="text-align:right;">` + this.comma(result.data_0006_7[i]["ST_P"]) + `</td>`;
          html_06_07_WT += `<td style="text-align:right;">` + this.comma(result.data_0006_7[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_06_ST_P += 0;
          this.Num_06_WT_P += 0;
          this.Num_07_ST_P += 0;
          this.Num_07_WT_P += 0;

          html_06_07_title_sub += `<td></td>`;
          html_06_07_ST += `<td></td>`;
          html_06_07_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_06_07_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_06_07_ST += `<td style="text-align:right;">` + this.comma(this.Num_06_ST_P) + `</td><td>`+ this.comma(Number((this.Num_06_ST_P) / this.info_price * 100).toFixed(1) +`</td><td>` + this.Num_07_ST_P + `</td><td>`+ Number((this.Num_07_ST_P) / this.info_price * 100).toFixed(1)) +`</td>`;
          html_06_07_WT += `<td style="text-align:right;">` + this.comma(this.Num_06_WT_P) + `</td><td>`+ this.comma(Number((this.Num_06_WT_P) / this.info_price * 100).toFixed(1) +`</td><td>` + this.Num_07_WT_P + `</td><td>`+ Number((this.Num_07_WT_P) / this.info_price * 100).toFixed(1)) +`</td>`;

          html_06_07_title = ` <td rowspan="3" style="text-align:center;">1</td>`;
          html_06_07_title += `<td rowspan="3" style="text-align:center;">설계비</td>`;
          html_06_07_title += `<td rowspan="3" style="text-align:right;">`+this.comma((this.Num_06_ST_P + this.Num_07_ST_P)) +`</td>`;
          html_06_07_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number((this.Num_06_ST_P + this.Num_07_ST_P) / this.info_price * 100).toFixed(1)) +`</td>`;
          html_06_07_title += `<td style="text-align:center;">업체</td>`;
          html_06_07_title += html_06_07_title_sub;

          this.detail_sum_rt += Number(Number((this.Num_06_ST_P + this.Num_07_ST_P) / this.info_price * 100).toFixed(1));
        }
      }
      //설계비-------------------------end------------------------


      //소재비-------------------------start------------------------
      let html_04_title = "";
      let html_04_title_sub = "";
      let html_04_ST = "";
      let html_04_WT = "";
      this.Num_04_ST_P = 0;
      this.Num_04_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_04_ST = `<td style="text-align:center;">계획</td>`;
          html_04_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_04_ST_P += Number(result.data_0004[i]["ST_P"]);
          this.Num_04_WT_P += Number(result.data_0004[i]["WT_P"]);

          html_04_title_sub += `<td style="text-align:center;">` + (result.data_0004[i]["NM"] || "") + `</td>`;
          html_04_ST += `<td style="text-align:right;">` + this.comma(result.data_0004[i]["ST_P"]) + `</td>`;
          html_04_WT += `<td style="text-align:right;">` + this.comma(result.data_0004[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_04_ST_P += 0;
          this.Num_04_WT_P += 0;

          html_04_title_sub += `<td></td>`;
          html_04_ST += `<td></td>`;
          html_04_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_04_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_04_ST += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_04_ST_P + `</td><td>`+ Number(this.Num_04_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_04_WT += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_04_WT_P + `</td><td>`+ Number(this.Num_04_WT_P / this.info_price * 100).toFixed(1)) +`</td>`;

          html_04_title = ` <td rowspan="3" style="text-align:center;">2</td>`;
          html_04_title += `<td rowspan="3" style="text-align:center;">소재비</td>`;
          html_04_title += `<td rowspan="3" style="text-align:right;">` + this.comma(this.Num_04_ST_P) + `</td>`;
          html_04_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_04_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_04_title += `<td style="text-align:center;">업체</td>`;
          html_04_title += html_04_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_04_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //소재비-------------------------end------------------------

      //면삭비-------------------------start------------------------
      let html_05_title = "";
      let html_05_title_sub = "";
      let html_05_ST = "";
      let html_05_WT = "";
      this.Num_05_ST_P = 0;
      this.Num_05_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_05_ST = `<td style="text-align:center;">계획</td>`;
          html_05_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_05_ST_P += Number(result.data_0005[i]["ST_P"]);
          this.Num_05_WT_P += Number(result.data_0005[i]["WT_P"]);

          html_05_title_sub += `<td style="text-align:center;">` + (result.data_0005[i]["NM"] || "") + `</td>`;
          html_05_ST += `<td style="text-align:right;">` + this.comma(result.data_0005[i]["ST_P"]) + `</td>`;
          html_05_WT += `<td style="text-align:right;">` + this.comma(result.data_0005[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_05_ST_P += 0;
          this.Num_05_WT_P += 0;

          html_05_title_sub += `<td></td>`;
          html_05_ST += `<td></td>`;
          html_05_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_05_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_05_ST += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_05_ST_P) + `</td><td>`+ this.comma(Number(this.Num_05_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_05_WT += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_05_WT_P) + `</td><td>`+ this.comma(Number(this.Num_05_WT_P / this.info_price * 100).toFixed(1)) +`</td>`;

          html_05_title = ` <td rowspan="3" style="text-align:center;">3</td>`;
          html_05_title += `<td rowspan="3" style="text-align:center;">면삭비</td>`;
          html_05_title += `<td rowspan="3" style="text-align:right;">` + this.comma(this.Num_05_ST_P) + `</td>`;
          html_05_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_05_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_05_title += `<td style="text-align:center;">업체</td>`;
          html_05_title += html_05_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_05_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //면삭비-------------------------end------------------------


      //구매품-------------------------start------------------------
      let html_03_title = "";
      let html_03_title_sub = "";
      let html_03_ST = "";
      let html_03_WT = "";

      this.Num_03_ST_P = 0;
      this.Num_03_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_03_ST = `<td style="text-align:center;">계획</td>`;
          html_03_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_03_ST_P += Number(result.data_0003[i]["ST_P"]);
          this.Num_03_WT_P += Number(result.data_0003[i]["WT_P"]);

          html_03_title_sub += `<td style="text-align:center;">` + (result.data_0003[i]["NM"] || "") + `</td>`;
          html_03_ST += `<td style="text-align:right;">` + this.comma(result.data_0003[i]["ST_P"]) + `</td>`;
          html_03_WT += `<td style="text-align:right;">` + this.comma(result.data_0003[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_03_ST_P += 0;
          this.Num_03_WT_P += 0;

          html_03_title_sub += `<td></td>`;
          html_03_ST += `<td></td>`;
          html_03_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_03_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_03_ST += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_03_ST_P) + `</td><td>`+ this.comma(Number(this.Num_03_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_03_WT += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_03_WT_P) + `</td><td>`+ this.comma(Number(this.Num_03_WT_P / this.info_price * 100).toFixed(1)) +`</td>`;

          html_03_title = ` <td rowspan="3" style="text-align:center;">4</td>`;
          html_03_title += `<td rowspan="3" style="text-align:center;">구매품</td>`;
          html_03_title += `<td rowspan="3" style="text-align:right;">`+this.comma(this.Num_03_ST_P)+`</td>`;
          html_03_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_03_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_03_title += `<td style="text-align:center;">업체</td>`;
          html_03_title += html_03_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_03_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //구매품-------------------------end------------------------


      //외주가공비-------------------------start------------------------
      let html_02_title = "";
      let html_02_title_sub = "";
      let html_02_ST = "";
      let html_02_WT = "";

      this.Num_02_ST_P = 0;
      this.Num_02_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_02_ST = `<td style="text-align:center;">계획</td>`;
          html_02_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_02_ST_P += Number(result.data_0002[i]["ST_P"]);
          this.Num_02_WT_P += Number(result.data_0002[i]["WT_P"]);

          html_02_title_sub += `<td style="text-align:center;">` + (result.data_0002[i]["NM"] || "") + `</td>`;
          html_02_ST += `<td style="text-align:right;">` + this.comma(result.data_0002[i]["ST_P"]) + `</td>`;
          html_02_WT += `<td style="text-align:right;">` + this.comma(result.data_0002[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_02_ST_P += 0;
          this.Num_02_WT_P += 0;

          html_02_title_sub += `<td></td>`;
          html_02_ST += `<td></td>`;
          html_02_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_02_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_02_ST += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_02_ST_P) + `</td><td>`+ this.comma(Number(this.Num_02_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_02_WT += `<td></td><td></td><td style="text-align:right;">` + this.comma(this.Num_02_WT_P) + `</td><td>`+ this.comma(Number(this.Num_02_WT_P / this.info_price * 100).toFixed(1)) +`</td>`;

          html_02_title = ` <td rowspan="3" style="text-align:center;">5</td>`;
          html_02_title += `<td rowspan="3" style="text-align:center;">외주가공비</td>`;
          html_02_title += `<td rowspan="3" style="text-align:right;">`+this.comma(this.Num_02_ST_P)+`</td>`;
          html_02_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_02_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_02_title += `<td style="text-align:center;">업체</td>`;
          html_02_title += html_02_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_02_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //외주가공비-------------------------end------------------------

      //사내가공비-------------------------start------------------------
      let html_01_title = "";
      let html_01_title_sub = "";
      let html_01_ST = "";
      let html_01_WT = "";

      this.Num_01_ST_P = 0;
      this.Num_01_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_01_ST = `<td style="text-align:center;">계획</td>`;
          html_01_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_01_ST_P += Number(result.data_0001[i]["ST_P"]);
          this.Num_01_WT_P += Number(result.data_0001[i]["WT_P"]);

          html_01_title_sub += `<td style="text-align:center;">` + (result.data_0001[i]["NM"] || "") + `</td>`;
          html_01_ST += `<td style="text-align:right;">` + this.comma(result.data_0001[i]["ST_P"]) + `</td>`;
          html_01_WT += `<td style="text-align:right;">` + this.comma(result.data_0001[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_01_ST_P += 0;
          this.Num_01_WT_P += 0;

          html_01_title_sub += `<td></td>`;
          html_01_ST += `<td></td>`;
          html_01_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_01_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_01_ST += `<td style="text-align:right;">` + this.comma(this.Num_01_ST_P) + `</td><td>`+ this.comma(Number(this.Num_01_ST_P / this.info_price * 100).toFixed(1)) +`</td><td></td><td></td>`;
          html_01_WT += `<td style="text-align:right;">` + this.comma(this.Num_01_WT_P) + `</td><td>`+ this.comma(Number(this.Num_01_WT_P / this.info_price * 100).toFixed(1)) +`</td><td></td><td></td>`;

          html_01_title = ` <td rowspan="3" style="text-align:center;">6</td>`;
          html_01_title += `<td rowspan="3" style="text-align:center;">사내가공비</td>`;
          html_01_title += `<td rowspan="3" style="text-align:right;">`+this.comma(this.Num_01_ST_P)+`</td>`;
          html_01_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_01_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_01_title += `<td style="text-align:center;">업체</td>`;
          html_01_title += html_01_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_01_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //사내가공비-------------------------end------------------------

      //조립비-------------------------start------------------------
      let html_08_title = "";
      let html_08_title_sub = "";
      let html_08_ST = "";
      let html_08_WT = "";

      this.Num_08_ST_P = 0;
      this.Num_08_WT_P = 0;
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          html_08_ST = `<td style="text-align:center;">계획</td>`;
          html_08_WT = `<td style="text-align:center;">실적</td>`;
        }
        //데이터 유무 판단
        try {
          this.Num_08_ST_P += Number(result.data_0008[i]["ST_P"]);
          this.Num_08_WT_P += Number(result.data_0008[i]["WT_P"]);

          html_08_title_sub += `<td style="text-align:center;">` + (result.data_0008[i]["NM"] || "") + `</td>`;
          html_08_ST += `<td style="text-align:right;">` + this.comma(result.data_0008[i]["ST_P"]) + `</td>`;
          html_08_WT += `<td style="text-align:right;">` + this.comma(result.data_0008[i]["WT_P"]) + `</td>`;
        } catch (e) {
          this.Num_08_ST_P += 0;
          this.Num_08_WT_P += 0;

          html_08_title_sub += `<td></td>`;
          html_08_ST += `<td></td>`;
          html_08_WT += `<td></td>`;
        }

        if (i == (colspan - 1)) {
          html_08_title_sub += `<td></td><td></td><td></td><td></td>`;
          html_08_ST += `<td style="text-align:right;">` + this.comma(this.Num_08_ST_P) + `</td><td>`+ this.comma(Number(this.Num_08_ST_P / this.info_price * 100).toFixed(1)) +`</td><td></td><td></td>`;
          html_08_WT += `<td style="text-align:right;">` + this.comma(this.Num_08_WT_P) + `</td><td>`+ this.comma(Number(this.Num_08_WT_P / this.info_price * 100).toFixed(1)) +`</td><td></td><td></td>`;

          html_08_title = ` <td rowspan="3" style="text-align:center;">7</td>`;
          html_08_title += `<td rowspan="3" style="text-align:center;">조립비</td>`;
          html_08_title += `<td rowspan="3" style="text-align:right;">`+this.comma(this.Num_08_ST_P)+`</td>`;
          html_08_title += `<td rowspan="3" style="text-align:center;">`+ this.comma(Number(this.Num_08_ST_P / this.info_price * 100).toFixed(1)) +`</td>`;
          html_08_title += `<td style="text-align:center;">업체</td>`;
          html_08_title += html_08_title_sub;

          this.detail_sum_rt += Number(Number(this.Num_08_ST_P / this.info_price * 100).toFixed(1));
        }
      }
      //조립비-------------------------end------------------------

      //합계-------------------------start------------------------
      let html_00_ST = "";
      let html_00_WT = "";
      for (let i = 0; i < colspan; i++) {
        if (i == 0) {
          let tot_st_sum =Number(this.Num_01_ST_P) + Number(this.Num_08_ST_P) +
                        Number(this.Num_06_ST_P) + Number(this.Num_07_ST_P) + Number(this.Num_05_ST_P) +
                        Number(this.Num_03_ST_P) + Number(this.Num_02_ST_P) +
                        Number(this.Num_04_ST_P);

          html_00_ST = ` <td rowspan="2" colspan="2" style="text-align:center;">합계</td>`;
          html_00_ST += `<td rowspan="2" style="text-align:center;">`+this.comma(tot_st_sum)+`</td>`;
          html_00_ST += `<td rowspan="2" style="text-align:center;">`+this.comma(this.detail_sum_rt)+`</td>`;
          html_00_ST += `<td style="text-align:center;">계획</td>`;

          html_00_WT = `<td style="text-align:center;">실적</td>`;
        }

        html_00_ST += `<td></td>`;
        html_00_WT += `<td></td>`;

        if (i == (colspan - 1)) {
          let out_tot_st_sum = Number(this.Num_07_ST_P)  + Number(this.Num_05_ST_P) +
                        Number(this.Num_03_ST_P) + Number(this.Num_02_ST_P) +
                        Number(this.Num_04_ST_P);
          let out_tot_wt_sum = Number(this.Num_07_WT_P) + Number(this.Num_05_WT_P) +
                        Number(this.Num_03_WT_P) + Number(this.Num_02_WT_P) +
                        Number(this.Num_04_WT_P);

          let in_tot_st_sum =Number(this.Num_01_ST_P) + Number(this.Num_08_ST_P) + Number(this.Num_06_ST_P);
          let in_tot_wt_sum =Number(this.Num_01_WT_P) + Number(this.Num_08_WT_P) + Number(this.Num_06_WT_P);

          html_00_ST += `<td style="text-align:right;">` + this.comma(in_tot_st_sum) + `</td><td>`+ this.comma(Number(in_tot_st_sum / this.info_price * 100).toFixed(1)) +`</td><td style="text-align:right;">`+this.comma(out_tot_st_sum)+`</td><td>`+ this.comma(Number(out_tot_st_sum / this.info_price * 100).toFixed(1)) +`</td>`;
          html_00_WT += `<td style="text-align:right;">` + this.comma(in_tot_wt_sum) + `</td><td>`+ this.comma(Number(in_tot_wt_sum / this.info_price * 100).toFixed(1)) +`</td><td style="text-align:right;">`+this.comma(out_tot_wt_sum)+`</td><td>`+ this.comma(Number(out_tot_wt_sum / this.info_price * 100).toFixed(1)) +`</td>`;
        }
      }
      //합계-------------------------end------------------------

      let html = `
        <table border="1" class="table table-bordered">
          <tr>
            <th style="text-align:center;">NO</th>
            <th style="text-align:center;">계정비</th>
            <th style="text-align:center;">BOM산출비용</th>
            <th style="text-align:center;">비율</th>
            <th style="text-align:center;">구분</th>
            <th style="text-align:center;" colspan="`+ colspan + `">집행내역</th>
            <th style="text-align:center;">사내집행</th>
            <th style="text-align:center;">비율</th>
            <th style="text-align:center;">외주집행</th>
            <th style="text-align:center;">비율</th>
          </tr>
          <tr>`+ html_06_07_title + `</tr>
          <tr>`+ html_06_07_ST + `</tr>
          <tr>`+ html_06_07_WT + `</tr>
          <tr>`+ html_04_title + `</tr>
          <tr>`+ html_04_ST + `</tr>
          <tr>`+ html_04_WT + `</tr>
          <tr>`+ html_05_title + `</tr>
          <tr>`+ html_05_ST + `</tr>
          <tr>`+ html_05_WT + `</tr>
          <tr>`+ html_03_title + `</tr>
          <tr>`+ html_03_ST + `</tr>
          <tr>`+ html_03_WT + `</tr>
          <tr>`+ html_02_title + `</tr>
          <tr>`+ html_02_ST + `</tr>
          <tr>`+ html_02_WT + `</tr>
          <tr>`+ html_01_title + `</tr>
          <tr>`+ html_01_ST + `</tr>
          <tr>`+ html_01_WT + `</tr>
          <tr>`+ html_08_title + `</tr>
          <tr>`+ html_08_ST + `</tr>
          <tr>`+ html_08_WT + `</tr>
          <tr>`+ html_00_ST + `</tr>
          <tr>`+ html_00_WT + `</tr>
        </table>
      `;

      $("#html_detail").html(html);
    }

    html_foot(result) {
      let html = `
        <table border="1" class="table table-bordered">
          <tr>
            <th style="text-align:center;" rowspan="2">집행예상</th>
            <th style="text-align:center;">제조원가(%)</th>
            <td style="text-align:right;">`+this.comma((this.info_price * this.order_rt_math))+`</td>
            <th style="text-align:center;" rowspan="2">설계비</th>
            <td style="text-align:right;" rowspan="2">` + this.comma((this.Num_06_ST_P + this.Num_07_ST_P)) + `</td>
            <th style="text-align:center;" rowspan="2">소재비/면삭비</th>
            <td style="text-align:right;" rowspan="2">` + this.comma((this.Num_04_ST_P + this.Num_05_ST_P)) + `</td>
            <th style="text-align:center;" rowspan="2">구매품</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_03_ST_P)+`</td>
            <th style="text-align:center;" rowspan="2">외주비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_02_ST_P)+`</td>
            <th style="text-align:center;" rowspan="2">가공비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_01_ST_P)+`</td>
            <th style="text-align:center;" rowspan="2">조립비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_08_ST_P)+`</td>
            <th style="text-align:center;" rowspan="2">합계</th>
            <td style="text-align:right;" rowspan="2">`+ this.comma((this.Num_06_ST_P + this.Num_07_ST_P +this.Num_04_ST_P + this.Num_05_ST_P + this.Num_03_ST_P + this.Num_02_ST_P + this.Num_01_ST_P + this.Num_08_ST_P))+`</td>
            <th style="text-align:center;">비율</th>
            <td style="text-align:right;">`+
              this.comma(Number((this.Num_06_ST_P + this.Num_07_ST_P + this.Num_04_ST_P + this.Num_05_ST_P + this.Num_03_ST_P + this.Num_02_ST_P + this.Num_01_ST_P + this.Num_08_ST_P) / (this.info_price * this.order_rt_math)  * 100).toFixed(1))
            +`</td>
            <th style="text-align:center;">손익금액</th>
            <td style="text-align:right;">`+this.comma(((this.info_price * this.order_rt_math) - (this.Num_06_ST_P + this.Num_07_ST_P + this.Num_04_ST_P + this.Num_05_ST_P + this.Num_03_ST_P + this.Num_02_ST_P + this.Num_01_ST_P + this.Num_08_ST_P))) +`</td>
          </tr>
          <tr>
            <th style="text-align:center;">수주가</th>
            <td style="text-align:right;">`+this.comma(this.info_price)+`</td>
            <th style="text-align:center;">비율</th>
            <td style="text-align:right;">`+
              this.comma(Number((this.Num_06_ST_P + this.Num_07_ST_P + this.Num_04_ST_P + this.Num_05_ST_P + this.Num_03_ST_P + this.Num_02_ST_P + this.Num_01_ST_P + this.Num_08_ST_P) / (this.info_price) * 100).toFixed(1))
            +`</td>
            <th style="text-align:center;">손익금액</th>
            <td style="text-align:right;">`+this.comma(((this.info_price) - (this.Num_06_ST_P + this.Num_07_ST_P + this.Num_04_ST_P + this.Num_05_ST_P + this.Num_03_ST_P + this.Num_02_ST_P + this.Num_01_ST_P + this.Num_08_ST_P))) +`</td>
          </tr>

          <tr>
            <th style="text-align:center;"rowspan="2">집행결과</th>
            <th style="text-align:center;">제조원가(%)</th>
            <td style="text-align:right;">`+this.comma((this.info_price * this.order_rt_math))+`</td>
            <th style="text-align:center;" rowspan="2">설계비</th>
            <td style="text-align:right;" rowspan="2">` + this.comma((this.Num_06_WT_P + this.Num_07_WT_P)) + `</td>
            <th style="text-align:center;" rowspan="2">소재비/면삭비</th>
            <td style="text-align:right;" rowspan="2">` + this.comma((this.Num_04_WT_P + this.Num_05_WT_P)) + `</td>
            <th style="text-align:center;" rowspan="2">구매품</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_03_WT_P)+`</td>
            <th style="text-align:center;" rowspan="2">외주비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_02_WT_P)+`</td>
            <th style="text-align:center;" rowspan="2">가공비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_01_WT_P)+`</td>
            <th style="text-align:center;" rowspan="2">조립비</th>
            <td style="text-align:right;" rowspan="2">`+this.comma(this.Num_08_WT_P)+`</td>
            <th style="text-align:center;" rowspan="2">합계</th>
            <td style="text-align:right;" rowspan="2">`+ this.comma((this.Num_06_WT_P + this.Num_07_WT_P + this.Num_04_WT_P + this.Num_05_WT_P + this.Num_03_WT_P + this.Num_02_WT_P + this.Num_01_WT_P + this.Num_08_WT_P))+`</td>
            <th style="text-align:center;">비율</th>
            <td style="text-align:right;">`+
              this.comma(Number((this.Num_06_WT_P + this.Num_07_WT_P + this.Num_04_WT_P + this.Num_05_WT_P + this.Num_03_WT_P + this.Num_02_WT_P + this.Num_01_WT_P + this.Num_08_WT_P) / (this.info_price * this.order_rt_math) * 100).toFixed(1))
            +`</td>
            <th style="text-align:center;">손익금액</th>
            <td style="text-align:right;">`+this.comma(((this.info_price * this.order_rt_math) - (this.Num_06_WT_P + this.Num_07_WT_P + this.Num_04_WT_P + this.Num_05_WT_P + this.Num_03_WT_P + this.Num_02_WT_P + this.Num_01_WT_P + this.Num_08_WT_P))) +`</td>
          </tr>
          <tr>
            <th style="text-align:center;">수주가</th>
            <td style="text-align:right;">`+this.comma(this.info_price)+`</td>
            <th style="text-align:center;">비율</th>
            <td style="text-align:right;">`+
              this.comma(Number((this.Num_06_WT_P + this.Num_07_WT_P + this.Num_04_WT_P + this.Num_05_WT_P + this.Num_03_WT_P + this.Num_02_WT_P + this.Num_01_WT_P + this.Num_08_WT_P) / (this.info_price) * 100).toFixed(1))
            +`</td>
            <th style="text-align:center;">손익금액</th>
            <td style="text-align:right;">`+this.comma(((this.info_price) - (this.Num_06_WT_P + this.Num_07_WT_P + this.Num_04_WT_P + this.Num_05_WT_P + this.Num_03_WT_P + this.Num_02_WT_P + this.Num_01_WT_P + this.Num_08_WT_P))) +`</td>
          </tr>




        `;

        $("#html_foot").html(html+
          `  <tr>
              <th style="text-align:center;" colspan="2">수주내용</th>
              <td colspan="19"><br /><br /><br /></td>
            </tr>
            <tr>
              <th style="text-align:center;" colspan="2">향후대책</th>
              <td colspan="19"><br /><br /><br /></td>
            </tr>
          `
        );
        $("#html_foot2").html(html);
    }

    tableToExcel(table) {
      let uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>{table}</html>'
        //, base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      //window.location.href = uri + base64(format(template, ctx))
      var link = document.createElement('a');
      link.download = "원가내역서";
      link.href = uri + base64(format(template, ctx));
      link.click();
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
    this.Data_Load();
  }
  //수주선택 모달--------------end


  //외주조회 팝업전용 시작
  amt_order_id;
  @ViewChild('lgModal_pop_outsourcing_amt_view') public lgModal_pop_outsourcing_amt_view:ModalDirective;
  private open_lgModal_out_amt():void {
    this.amt_order_id = this.order_id;
   this.lgModal_pop_outsourcing_amt_view.show();
  }

  close_lgModal_out_amt() {
    this.amt_order_id = null;
    this.lgModal_pop_outsourcing_amt_view.hide();
  }
  //외주조회 팝업전용 끝

}
