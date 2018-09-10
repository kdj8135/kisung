import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings,DataStateChangeEvent } from '@progress/kendo-angular-grid';
import {ModalDirective} from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService} from "../../../shared/user/user.service";

@Component({
  selector: 'app-PracticalTongPersonList',
  templateUrl: './PracticalTongPersonList.component.html',
  styleUrls: ['./PracticalTongPersonList.component.css']
})
export class PracticalTongPersonListComponent {

  //팝업전용 시작
  private Arr_Cd_Nm: {};
  private Use_YN : string;
  private Pop_dept_cd : string;
  private Expanded_YN : string;
  //팝업전용 끝

  user:any; //공통 세션

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
  private chk_lowrank : string;

  @ViewChild('From_d') From_d: ElementRef;
  @ViewChild('To_d') To_d: ElementRef;

  constructor(private pmsApiService: PmsApiService
  , private userService: UserService) {

    this.user = this.userService.getLoginInfo()
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
    //this.loadProducts();
    this.searchGrid();
  }

  private searchGrid(): void {

    this.mySelection = [];

    //시작일자가 종료일자보다 큰경우 종료일자로 변경
    if(this.From_d.nativeElement.value > this.To_d.nativeElement.value){
        this.From_d.nativeElement.value = this.To_d.nativeElement.value
    }

    let param = [{
      dept_cd : this.Dept_CD
      , from_d : this.From_d.nativeElement.value
      , to_d : this.To_d.nativeElement.value
      , chk_lowrank : this.chk_lowrank
      , page_from : this.skip, page_to : this.skip + this.pageSize //page change
      , sort_dir : this.sort_dir , sort_field : this.sort_field //sort orderBy
    }];
    this.pmsApiService.fetch('PracticalTongPersonList/practicaltongperson', param).subscribe(result => {

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
    //event.columnIndex  :  현재 클릭된 컬럼 index 0부터~
    if(event.columnIndex == "2")
    {
      this.idx = event.dataItem.EMP_NO;

    }

  }


  private Search():void {
    this.searchGrid();
  }


  ngOnInit() {
    this.From_d.nativeElement.value = new Date().toISOString().substr(0, 10).replace('T', ' ');
    this.To_d.nativeElement.value = new Date().toISOString().substr(0, 10).replace('T', ' ');

    this.DeptName = this.user.deptNm;
    this.Dept_CD = this.user.deptCd;

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
