import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings,DataStateChangeEvent } from '@progress/kendo-angular-grid';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";

import {ModalDirective} from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";

@FadeInTop()
@Component({
  selector: 'app-boardlist',
  templateUrl: './board_list.component.html',
  styleUrls: ['./board_list.component.css']
})
export class BoardListComponent {

  idx : string = ""; //child key
  private gridData: any[];
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort: SortDescriptor[] = [];
  private mySelection: any[] = [];
  private sort_dir : string = "";
  private sort_field : string = "";

  private subject_text : string;
  private name_text : string;

  constructor(
    private pmsApiService: PmsApiService
    ,private userService: UserService) {

  }

  protected pageChange(event: PageChangeEvent): void {

    this.skip = event.skip;
    this.searchGrid();
  }

  private sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    if (this.sort.length > 0) {
      if(this.sort[0].dir != undefined) this.sort_dir = this.sort[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.sort[0].field;
    }

    this.searchGrid();
  }

  private searchGrid(): void {
    this.mySelection = [];

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , subject_text : this.subject_text, name_text : this.name_text
    , page_from : this.skip, page_to : this.skip + this.pageSize //page change
    , sort_dir : this.sort_dir , sort_field : this.sort_field //sort orderBy
    }];
    this.pmsApiService.fetch('board/board_list', param).subscribe(result => {

      //console.log(result.data);
      this.gridData = result.data;
      this.gridView = {
        data: this.gridData,
        total: result.cnt
      };
    })

  }

  private click_pop(event) {

    //event.columnIndex  :  현재 클릭된 컬럼 index 0부터~
    //if(event.columnIndex == "2")
    //{
      this.idx = event.dataItem.BOARD_ID;
      this.lgModal_view.show();
    //}

  }

  @ViewChild('lgModal_reg') public lgModal_reg:ModalDirective;
  @ViewChild('lgModal_view') public lgModal_view:ModalDirective;

  //뷰에서 저장창 띄움
  private ShowRegModal():void {
    this.lgModal_view.hide();
    this.lgModal_reg.show();
  }

  //등록창에서 등록후 리프레쉬
  private Refresh_HideModal_Reg():void {
    this.searchGrid();
    this.lgModal_reg.hide()
    this.idx = "";
  }

  //뷰에서 삭제후 리프레쉬
  private Refresh_HideModal_View():void {
    this.searchGrid();
    this.lgModal_view.hide()
    this.idx = "";
  }

  private Search():void {
    this.searchGrid();
  }

  private RegModal():void {
    this.idx = "";
    jQuery('#summernote').summernote('code', ""); //등록시 초기화 Editor reg화면에서는 선언시점오류
    this.lgModal_reg.show()
  }

  ngOnInit() {
    this.subject_text = "";
    this.name_text = "";

    this.searchGrid();
  }

}
