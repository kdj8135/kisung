import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotificationService } from "../../../shared/utils/notification.service";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

export class SelectBox {
  constructor(public id: string, public name: string) { }
}

@Component({
  selector: 'app-selectuser',
  templateUrl: './selectuser.component.html',
  styleUrls: ['./selectuser.component.css']
})
export class SelectuserComponent implements OnInit {
  @Input() Arr_Cd_Nm: any[] = [];         //한화면에 부서등록이 여러개인경우 구분값
  @Input() Use_YN: string = "Y";          //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
  @Input() Expanded_YN: string = "Y";     //트리 펼침 Y = 모두다
  @Input() Pop_dept_cd: string = "";      //선택되어야할 부서코드

  @Input() Multi_Use: boolean = true;      //true = single , false = multiple
  @Input() Mode_Gubun: string = "single"; //true = single , false = multiple
  @Input() Arr_multi_list: any[] = [];      //선택대상자를 리스트에 표시하기 위함
  //@Input() Arr_multi_list: any[] = [{id : "1111111", nm : "1112222"},{id : "555555", nm : "55556666"}];      //선택대상자를 리스트에 표시하기 위함

  @Output() selectuser_ok = new EventEmitter(); //등록창 닫기

  selectuser(){
    this.selectuser_ok.emit(this.arruser);
  }
  @Output() selectuser_close = new EventEmitter(); //등록창 닫기
  closeuser(){
    this.selectuser_close.emit('');
  }
  //조직도 트리
  private dept_tree: any[];
  private dept_id: string;
  private dept_nm: string;
  private dept_parent_id: string;
  private arruser: {};
  private expandedKeys: any[] = [];
  private selectedKeys: any[] = [];

  //사용자 그리드
  private mySelection: any[] = [];
  private gridData: any[];
  private gridView: GridDataResult;
  private pageSize: number = 15;
  private skip: number = 0;
  private sort_dir: string = "";
  private sort_field: string = "";
  private sort: SortDescriptor[] = [];

  //검색 조회
  public S_EMP_NM : string;
  private S_DEPT_NO : string;

  //선택대상자
  public pop_gridData_user: any[];
  public pop_gridView_user: GridDataResult;
  public pop_gridSort_user: SortDescriptor[] = [];
  public pop_gridSelection_user: any[] = [];
  public pop_selectbox_list = [];
  public pop_select_user: any[];

  private popwidth = "1100";
  private article_tree = "col-sm-12 col-md-12 col-lg-4";
  private article_grid = "col-sm-12 col-md-12 col-lg-4";
  private article_list = "col-sm-12 col-md-12 col-lg-4";

  constructor(
     private notificationService: NotificationService
    , private pmsApiService: PmsApiService
  ) {

  }

  ngOnChanges() {
    //alert(this.Arr_Cd_Nm +"||"+this.Use_YN +"||"+this.Expanded_YN  +"||"+this.Pop_dept_cd)
    if(this.Multi_Use == false){
      this.popwidth = "1100";
      this.article_tree = "col-sm-12 col-md-12 col-lg-4";
      this.article_grid = "col-sm-12 col-md-12 col-lg-4";
      this.article_list = "col-sm-12 col-md-12 col-lg-4";
    }
    else{
      this.popwidth = "800";
      this.article_tree = "col-sm-12 col-md-12 col-lg-6";
      this.article_grid = "col-sm-12 col-md-12 col-lg-6";
      this.article_list = "";
    }

    this.S_EMP_NM = ""; //사용자 검색 초기화

    if(this.Expanded_YN == "Y") this.serachTree_Dept_expanded();
    this.serachTree_Dept();
    this.searchGrid();

    //선택대상자 폴더에 데이터 넣기 멀티일경우
    //멀티모드 this.multi_use == fa 싱글모드 display=none
    if(this.Multi_Use == false){
      this.Arr_multi_list.forEach((item, index) => {
        //console.log(item.id+"||"+item.nm)
        this.pop_selectbox_list.push(new SelectBox(item.id, item.nm));
      });
    }

  }

  ngOnInit() {
  }

  //트리전체 펼침 text 가져오기
  private serachTree_Dept_expanded() {

    if (this.Use_YN == undefined) this.Use_YN = "Y";
    let param = [{
      use_yn: this.Use_YN
    }];
    this.pmsApiService.fetch('WPCommon/WPCommon_TreeExpanded', param).subscribe(result => {
      if (result.code == "00") {

        //console.log(result.data);
        let arr_text = [];
        for (let obj of result.data) {
              arr_text.push(obj.text);
              //console.log(obj.id);
        }

        this.expandedKeys = arr_text; //화면 펼침
        this.selectedKeys = [this.Pop_dept_cd]; //선택

      } else {
        alert("오류 리스트");
      }
    })

  }

  //트리조회
  private serachTree_Dept() {

    if (this.Use_YN == undefined) this.Use_YN = "Y";

    let param = [{
      use_yn: this.Use_YN
    }];
    this.pmsApiService.fetch('WPCommon/WPCommon_Tree', param).subscribe(result => {
      if (result.code == "00") {

        this.dept_tree = JSON.parse(result.data);

      } else {
        alert("오류 리스트");
      }
    })
  }

  private treeSelection(event: any): void {

    this.S_DEPT_NO = event.dataItem.id;
    this.searchGrid();
  }

  private SelectOk(): void {
    //멀티모드 this.multi_use == fa 싱글모드 display=none
    if(this.Multi_Use == false){
    let arr_member : any = [];
      this.pop_selectbox_list.forEach((item, index) => {
          //console.log(item.id + "||" + item.name)
          arr_member.push({id : item.id, name : item.name})
      });
      //console.log(arr_member)
    }
    this.selectuser();
  }

  public fetchChildren(node: any): Observable<any[]> {
      //return the parent node's items collection as children
      return of(node.items);
  }

  public hasChildren(node: any): boolean {
      //check if the parent node has children
      return node.items && node.items.length > 0;
  }

  private sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    if (this.sort.length > 0) {
      if (this.sort[0].dir != undefined) this.sort_dir = this.sort[0].dir;
      else this.sort_dir = "";
      this.sort_field = this.sort[0].field;
    }
    this.searchGrid();
  }

  protected pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.searchGrid();
  }

  private searchGrid(): void {
    this.mySelection = [];
    let param = [{
      //그리드 공통---start
      page_from: this.skip, page_to: this.skip + this.pageSize //page change
      , sort_dir: this.sort_dir, sort_field: this.sort_field //sort orderBy
      //그리드 공통---end
       , dept_cd: this.S_DEPT_NO
       , emp_nm: this.S_EMP_NM
    }];
    this.pmsApiService.fetch('WPCommon/WPCommon_User', param).subscribe(result => {
      this.gridData = result.data;
      //console.log(result.data);
      this.gridView = {
        //data: this.gridData.slice(this.skip, this.skip + this.pageSize),
        data: this.gridData,
        total: result.totalcnt
      };
    })

  }

  click_add(event) {
    //this.multi_use == true 싱글모드 display=none
    if(this.Multi_Use == true)
    {
      this.arruser = {
        cd : this.Arr_Cd_Nm["cd"],
        nm : this.Arr_Cd_Nm["nm"],
        emp_no : event.dataItem.EMP_NO,
        emp_nm : event.dataItem.UserName
      }
    }
  }

  public pop_add_user(): void {

    for (let i = 0; i < this.mySelection.length; i++) {
      for (let j = 0; j < this.gridData.length; j++) {
        if (this.gridData[j].EMP_NO == this.mySelection[i]) {
          let chk: boolean = false;

          this.pop_selectbox_list.forEach((item, index) => {
            if (item.id === this.gridData[j].EMP_NO) {
              chk = true;
            }
          });

          if (chk == false) {
            this.pop_selectbox_list.push(new SelectBox(this.gridData[j].EMP_NO, this.gridData[j].UserName));
          }
        }
      }
    }

  }

  public pop_del_user(): void {
    for (let i = 0; i < this.pop_select_user.length; i++) {
      this.pop_selectbox_list.forEach((item, index) => {
        if (item.id == this.pop_select_user[i]) {
          this.pop_selectbox_list.splice(index, 1);
        }
      });
    }
  }

  public pop_all_del_user(): void {
    this.pop_selectbox_list = [];
  }

}
