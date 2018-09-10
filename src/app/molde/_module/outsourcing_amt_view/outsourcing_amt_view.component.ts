import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

declare var $: JQueryStatic;
import 'jqueryui';

import * as XLSX from 'xlsx';
declare function unescape(s:string): string;
declare function escape(s:string): string;

@Component({
  selector: 'app-outsourcing-amt-view',
  templateUrl: './outsourcing_amt_view.component.html',
  styleUrls: ['./outsourcing_amt_view.component.css']
})
export class Outsourcing_Amt_View_Component implements OnInit {

  //셀렉터 뷰전용 시작
  @Input() order_id: string;
  @Output() outsourcing_amt_view_close = new EventEmitter(); //등록창 닫기
  closePop() {
    this.outsourcing_amt_view_close.emit('');
  }
  //셀렉터 뷰전용 끝

  user: any;

  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }

  ngOnInit() {

    //this.Data_Load();
  }

  ngOnChanges() {

    this.Data_Load();
  }

  private Data_Load() {
    if (this.order_id == undefined) return;
    //초기화
    $("#tbody").html("");

    let param = [{
      order_id: this.order_id
    }];
    this.pmsApiService.fetch('orderlist/outsourcing_amt_view', param).subscribe(result => {
      if (result.code == "00") {
        if (result.data.length > 0) {
          this.product_html(result.data);
        } else {
          this.nodata_html();
        }
      } else {
        alert("오류 등록");
      }
    });
  }

  nodata_html() {
    let html = ""
    html += "<tr>";
    html += " <td colspan='4' style='text-align:center;'>데이터가 없습니다.</td>";
    html += "</tr>";
    $("#tbody").append(html);
  }

  product_html(data) {

    let html = ""
    let total_amt : number = 0;
    for (let i = 0; i < data.length; i++) {
      html += "<tr>";
      html += " <td class='first' style='text-align:center;vertical-align:middle;'>";
      html +=     data[i].SUB_NM;
      html += " </td>";
      html += " <td class='first' style='text-align:right;vertical-align:middle;'>";
      html +=     data[i].SUM_OUTSOURCING_AMT;
      html += " </td>";
      html += " <td style='text-align:center;'>";
      html +=     data[i].VENDOR_NM;
      html += " </td>";
      html += " <td style='text-align:right;'>";
      html +=     data[i].OUTSOURCING_AMT;
      html += " </td>";
      html += "</tr>";
      total_amt += Number(data[i].OUTSOURCING_AMT.replace(/,/gi, ""));
    }
    html += "<tr>";
    html += " <td style='text-align:center;'>합계</td>";
    html += " <td style='text-align:right;'>";
    html +=     Number(total_amt).toLocaleString('en').split(".")[0];
    html += " </td>";
    html += " <td colspan='2'></td>";
    html += "</tr>";
    $("#tbody").append(html);

    //같은 값 rowspan cell병합
    // $(".first").each(function() {
    //   var rows = $(".first:contains('" + $(this).text() + "')");
    //   if (rows.length > 1) {
    //     rows.eq(0).attr("rowspan", rows.length);
    //     rows.not(":eq(0)").remove();
    //   }
    // });

    // 이전 행의 컬럼1, 컬럼2의 내용
		var beforeRow = {
			"col1Text" : null,
			"col2Text" : null
		};
		// rowspan 정보를 저장할 배열
		var rowspans = [];
		// 마지막으로 rowspan 처리한 rowIndex
		var rowSpaned = {
			col1 : 0,
			col2 : 0
		}

		$("#amtTable > tbody > tr").each(function(rowIndex) { // 테이블의 한 행씩 처리
			// 현재 행의 컬럼 1, 2 내용
			var currentRow = {
				"col1Text" : $(this).find("td:eq(0)").text(),
				"col2Text" : $(this).find("td:eq(1)").text()
			}

			// debug
			//console.log("---");
			//console.log("rowIndex = " + rowIndex + ", col1 = " + currentRow.col1Text + ", col2 = " + currentRow.col2Text);

			// 첫번째 행일 때는 비교 처리 없이 넘어감
			if (rowIndex == 0) {
				rowspans.push({
					"col1" : 1,
					"col2" : 1
				});

				beforeRow.col1Text = currentRow.col1Text;
				beforeRow.col2Text = currentRow.col2Text;

				// debug
				for (var i = 0; i < rowspans.length ; i++) {
				 	//console.log(rowspans[i]);
				}
				//console.log("last = " + beforeRow.col1Text + ", " + beforeRow.col2Text);

				return; // continue
			}

			// **현재 행**의 rowspan 정보
			// 아래의 비교 후 현재행의 컬럼1(col1)과 컬럼2(col2)이
			// rowspan 해야하는 지 (rowspan > 1)
			// 그냥 냅둬도 되는 지 (rowspan == 1)
			// 위의 행에 의해서 rowspan 되는 컬럼이기 때문에 지워줘야 하는 컬럼인지 (rowspan = -1)
			// 정보를 가지고 있게 된다.
			var rowspan = {
				"col1" : 1,
				"col2" : 1
			};

			// 이전 행의 컬럼1과 현재 행 컬럼1을 비교
			if (beforeRow.col1Text == currentRow.col1Text) { // 이전행 컬럼1과 현재행 컬럼1이 같다면
				// 컬럼1 처리 하기 전에 컬럼2 처리(비교)
				if (beforeRow.col2Text == currentRow.col2Text) { // 이전행 컬럼2와 현재행 컬럼2가 같다면
					// 마지막으로 rowspan한 행의 컬럼2 rowspan + 1
					rowspans[rowSpaned.col2].col2 += 1;
					// 현재 행의 컬럼2는 없어질 컬럼(rowspan = -1)
					rowspan.col2 = -1;
				} else { // 컬럼1은 같은데 컬럼2는 다른 경우
					// 이전행 컬럼2가 현재행 컬럼2이 된다.
					beforeRow.col2Text = currentRow.col2Text;
					// 현재행 컬럼2는 남는다.(rowspan = 1)
					rowspan.col2 = 1;
					// 현재행 컬럼2가 rowspan 대상이 된다.
					rowSpaned.col2 = rowIndex;
				}

				// 마지막으로 rowspan한 행의 컬럼1 rowspan + 1
				rowspans[rowSpaned.col1].col1 += 1;
				// 현재행 컬럼1은 없어질 컬럼이다(rowspan = -1)
				rowspan.col1 = -1;
			} else { // 이전행 컬럼1과 현재행 컬럼1가 다르다.
				// 컬럼1이 다르다는 것은 컬럼2도 다르다.

				// 다음 loop 준비
				// 비교 대상 값들 세팅
				beforeRow.col1Text = currentRow.col1Text;
				beforeRow.col2Text = currentRow.col2Text;
				// 현재 행과 이전행이 다르므로 현재행 rowspan 1부터 시작
				rowspan.col1 = 1;
				rowspan.col2 = 1;
				// 마지막으로 rowspan 처리된 행은 현재행
				rowSpaned.col1 = rowIndex;
				rowSpaned.col2 = rowIndex;
			}

			// 배열에 담아놓기
			rowspans.push(rowspan);

			// debug
			for (var i = 0; i < rowspans.length ; i++) {
				//console.log(rowspans[i]);
			}
			//console.log("last = " + beforeRow.col1Text + ", " + beforeRow.col2Text);
		});

		// 위의 계산에 의해 rowspan 값들을 가지고 실제 rowspan 한다.
		for (var i = 0; i < rowspans.length ; i++) {
			var rowspan = rowspans[i];

			// 1보다 크면 rowspan="값"
			// 1이면 그냥 냅둠
			// -1 이면 td를 remove


			// **컬럼 2부터 처리**
			if (rowspan.col2 > 1) {
				$("#amtTable > tbody > tr:eq(" + i + ") > td:eq(1)").attr("rowspan", rowspan.col2);
			} else if (rowspan.col2 == -1) {
				$("#amtTable > tbody > tr:eq(" + i + ") > td:eq(1)").remove();
			}

			if (rowspan.col1 > 1) {
				$("#amtTable > tbody > tr:eq(" + i + ") > td:eq(0)").attr("rowspan", rowspan.col1);
			} else if (rowspan.col1 == -1) {
				$("#amtTable > tbody > tr:eq(" + i + ") > td:eq(0)").remove();
			}
		}

  }

  tableToExcel(table){
      let uri = 'data:application/vnd.ms-excel;base64,'
          , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table border="1">{table}</table></body></html>'
          //, base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
          , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
          , format = function(s,c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
              if (!table.nodeType) table = document.getElementById(table)
              var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
               //window.location.href = uri + base64(format(template, ctx))
              var link = document.createElement('a');
              link.download = "외주비용";
              link.href = uri + base64(format(template, ctx));
              link.click();
  }



}
