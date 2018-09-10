import { Component, OnInit,ViewChild } from '@angular/core';
import { JsonApiService } from "../../../core/api/json-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NotificationService } from "../../../shared/utils/notification.service";
import { ModalDirective } from "ngx-bootstrap"; //모달

export class SelectBox1 {
  constructor(public id: string, public name: string) { }
}
export class SelectBox2 {
  constructor(public id: string, public name: string) { }
}

@Component({
  selector: 'app-stdprodlist',
  templateUrl: './stdprodlist.component.html',
  styleUrls: ['./stdprodlist.component.css']
})
export class StdprodlistComponent implements OnInit {
  public gridData_common: any[];
  public gridView_common: GridDataResult;
  public gridSort_common: SortDescriptor[] = [];
  public gridSelection_common: any[] = [];

  public select_bind_dt1 : any[]; //그룹 바인드할 DB를 담음
  public select_bind_dt2 : any[]; //그룹 바인드할 DB를 담음
  public selectbox_list1 = [];    //그룹배열을 담아놓음
  public selectbox_list2 = [];    //그룹배열을 담아놓음
  public sc_gubun1: string; //셀렉트박스 선언
  public sc_gubun2: string; //셀렉트박스 선언
  public search_box_nm : string;

  public idx : string = ""; //key

  constructor(private jsonApiService: JsonApiService, private notificationService: NotificationService)
  {
    //this.serachTree();
    this.searchGrid_Standart();
    this.Select_Gubun1();
  }

  ngOnInit() {
  }

  public hiddenColumns: string[] = ['no'];
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public add_user(): void {
    if (this.gridSelection_common.length == 0) {
      this.notificationService.smallBox({
        title: "목록 선택",
        content: "<i class='fa fa-clock-o'></i> <i>선택된 목록이 없습니다. 삭제하시려는 목록을 체크하세요.</i>",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    var arr_delet_id : string = "";

    for (let i = 0; i < this.gridSelection_common.length; i++) {
      for (let j = 0; j < this.gridData_common.length; j++) {
        if (this.gridData_common[j].no == this.gridSelection_common[i]) {
          if(arr_delet_id != "")
          {
            arr_delet_id += ","
          }
          arr_delet_id += this.gridData_common[j].no;
        }
      }
    }

    alert(arr_delet_id)
  }

  //삭제
  private Delete_Row(): void {
    //바인드
    for (let i = 0; i < this.select_bind_dt1.length; i++) {
      this.selectbox_list1.push(new SelectBox1(this.select_bind_dt1[i].group_code, this.select_bind_dt1[i].group_name));
    }

    //그룹, 검색 초기값 셋팅
    this.sc_gubun1 = "all";
    this.sc_gubun2 = "all";
    this.search_box_nm = "";
  }


  //셀렉트 박스 그룹 시작
  //1. 셀렉트 박스에 넣을 DB조회하여  ID, VALUE 가져오기
    public Select_Gubun1(): void {
      this.jsonApiService.fetch(`/mhkim/standard_selectBox0.json`)
        .subscribe((jsonData: any) => {
          this.select_bind_dt1 = jsonData;
          this.gubun_bind()
        })

    }
  //2. 셀렉트 박스에 ID, VALUE 삽입하기
    private gubun_bind(): void {
      //바인드
      for (let i = 0; i < this.select_bind_dt1.length; i++) {
        this.selectbox_list1.push(new SelectBox1(this.select_bind_dt1[i].group_code, this.select_bind_dt1[i].group_name));
      }

      //그룹, 검색 초기값 셋팅
      this.sc_gubun1 = "all";
      this.sc_gubun2 = "all";
      this.search_box_nm = "";
    }



  public ValonChange(event) {
    this.Select_Gubun2();
  }

  public Select_Gubun2(): void {
    this.jsonApiService.fetch(`/mhkim/standard_selectBox1.json`)
      .subscribe((jsonData: any) => {
        this.select_bind_dt2 = jsonData;
        this.gubun_bind2()
      })

  }

  private gubun_bind2(): void {
    //바인드
    this.selectbox_list2 = [];
    for (let i = 0; i < this.select_bind_dt2.length; i++) {
      this.selectbox_list2.push(new SelectBox2(this.select_bind_dt2[i].group_code, this.select_bind_dt2[i].group_name));
    }
    //그룹, 검색 초기값 셋팅
    this.sc_gubun2 = "all";

  }
  //셀렉트 박스 그룹 끝

  //메인코드 그리드 시작
    public sortChange_common(sort: SortDescriptor[]): void {
      this.gridSort_common = sort;
      this.loadGrid_Common();
    }

    private loadGrid_Common(): void {
      this.gridView_common = {
        data: orderBy(this.gridData_common, this.gridSort_common),
        total: this.gridData_common.length
      };
    }

    private searchGrid_Standart(): void {
      //this.Now_Click_Row = ""; //초기값 셋팅 (메인코드 클릭후 등록을 누르고 다시 하위코드 추가시 공백 방지)

      this.jsonApiService.fetch(`/mhkim/standard_grid.json`)
        .subscribe((jsonData: any) => {
          this.gridData_common = jsonData;
          this.loadGrid_Common();
          //this.pageSize_role = jsonData.length;
        })
    }

    //그리드 선택시 하위트리 불러오기
    private onSelectedKeysChange_common(event) {
      //this.mySelection 키로 해당 그리드 모든 정보 찾기
      for (let i = 0; i < this.gridData_common.length; i++) {
        if (this.gridData_common[i].no == this.gridSelection_common) {
            //this.output_nm = this.gridData_common[i].output_nm;
          break;
        }
      }

      //alert("main_code=" + this.gridSelection_common.toString());

      //키값 삽입
      this.idx = this.gridSelection_common.toString();

      //바로 창 열어야함. 펑션부르면 안됨
      //this.myModal_Main_reg.show();

    }
  //메인코드 그리드 끝

}
