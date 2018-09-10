import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import { customers } from './customers';
//import { CategoriesService } from './northwind.service';
import { products } from './products';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings,DataStateChangeEvent } from '@progress/kendo-angular-grid';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";

import {ModalDirective} from "ngx-bootstrap";
//import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { PmsApiService } from "../../../core/api/pms-api.service";
import { pmsConfig } from '../../../shared/pms.config';

@FadeInTop()
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent {

  //팝업전용 시작
  private Arr_Cd_Nm: {};
  private Use_YN : string;
  private Pop_dept_cd : string;
  private Expanded_YN : string;
  //팝업전용 끝

  idx : string = ""; //child key
  private gridData: any[];

  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort: SortDescriptor[] = [];
  private mySelection: any[] = [];
  private sort_dir : string = "";
  private sort_field : string = "";

  private Dept_CD : string;
  private DeptName : string;
  private ismem : string;
  private search_box : string;
  private isuse : string;
  private emp_no : string;

  T : boolean = false; //직책
  R : boolean = false; //직급
  P : boolean = false; //직위
  D : boolean = false; //직무
  O : boolean = false; //직군

  constructor(private pmsApiService: PmsApiService) {

  }

  protected pageChange(event: PageChangeEvent): void {

    this.skip = event.skip;

    //this.loadItems();
    this.searchGrid();
  }

  private sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    if (this.sort.length > 0) {
      if(this.sort[0].dir != undefined) this.sort_dir = this.sort[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.sort[0].field;
    }
    //console.log(this.sort_dir +"||"+this.sort_field)
    //this.loadProducts();
    this.searchGrid();
  }

  private searchGrid(): void {
    this.mySelection = [];

    //order by 시작
    // let sort_dir = "";
    // let sort_field = "";
    // if (this.sort.length > 0) {
    //   if(this.sort[0].dir != undefined) sort_dir = this.sort[0].dir;
    //   sort_field = this.sort[0].field;
    // }
    //order by 끝

    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , sc_ismem : this.ismem, search_box : this.search_box, dept_cd : this.Dept_CD
    , sc_isuse : this.isuse
    , page_from : this.skip, page_to : this.skip + this.pageSize //page change
    , sort_dir : this.sort_dir , sort_field : this.sort_field //sort orderBy
    }];
    this.pmsApiService.fetch('userlist/user', param).subscribe(result => {

      this.gridData = result.data;
      //alert(result.totalcnt);

      this.gridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData,
        total: result.totalcnt
      };
    })

  }

  private OnClickEvent(event) {
    //this.mySelection 키로 해당 그리드 모든 정보 찾기
    // for (let i = 0; i < this.gridData.length; i++) {
    //   if (this.gridData[i].EMP_NO == this.mySelection) {
    //       this.idx = this.gridData[i].EMP_NO;
    //     break;
    //   }
    // }

    //event.columnIndex  :  현재 클릭된 컬럼 index 0부터~
    //if(event.columnIndex == "2")
    //{
      this.idx = event.dataItem.EMP_NO;
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
  }

  //뷰에서 삭제후 리프레쉬
  private Refresh_HideModal_View():void {
    this.searchGrid();
    this.lgModal_view.hide()
  }

  private Search():void {
    this.searchGrid();
  }

  private RegModal():void {
    this.idx = "";
    this.lgModal_reg.show()
  }

  ngOnInit() {

    for (let obj of pmsConfig.User_joblist) {
              for (let key in obj) {
                  //console.log("key : " + key + ",  value : ", obj[key]);
                  let isView : boolean = false;
                  if (obj[key] == "Y") isView = false;
                  else isView = true;
                  this[key] = isView;
          }
    }

    this.Dept_CD = "";
    this.DeptName = "";
    this.ismem = "all";
    this.search_box = "";
    this.isuse = "all";

    //this.ismem = "all";
    //this.isuse = "all";

    this.searchGrid();
  }

  //모달창 선언
  @ViewChild('lgModal_pop_dept') public lgModal_pop_dept:ModalDirective;

  //메인코드 모달
  private Show_Pop_Dept_Modal(cd,nm):void {
     this.Pop_dept_cd = this.Dept_CD;
     this.Arr_Cd_Nm = {cd : cd, nm : nm};
     this.Use_YN = "Y";                     //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
     this.Expanded_YN ="Y";                 //트리 펼침 Y = 모두다
     this.lgModal_pop_dept.show();
  }

  private Close_Pop_Dept_Modal(arrdept):void {
     this[arrdept.cd] = arrdept.dept_id
     this[arrdept.nm] = arrdept.dept_nm

     this.lgModal_pop_dept.hide();
  }
}
