import { Component, OnInit, ViewChild } from '@angular/core';

import { JsonApiService } from "../../../core/api/json-api.service";


import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { NotificationService } from "../../../shared/utils/notification.service";

import { ModalDirective } from "ngx-bootstrap";

import { PmsApiService } from "../../../core/api/pms-api.service";
import { MlangService} from "../../../shared/mlang/mlang.service";


export class SelectBox {
  constructor(public id: string, public name: string) { }
}

@Component({
  selector: 'app-roleassignuser',
  templateUrl: './roleassignuser.component.html',
  styleUrls: ['./roleassignuser.component.css']
})
export class RoleassignuserComponent implements OnInit {

  public gridData_role: any[];
  public gridView_role: GridDataResult;
  public gridSort_role: SortDescriptor[] = [];
  public gridSelection_role: any[] = [];

  public data_tree: any[];

  public gridData_info: any[];
  public gridView_info: GridDataResult;
  public gridSort_info: SortDescriptor[] = [];


  public role_id: String = "";
  public role_nm: String = "";
  public tree_id: String = "";


  public pop_tree_id: String = "";
  public pop_user_nm: String = "";

  public pop_gridData_user: any[];
  public pop_gridView_user: GridDataResult;
  public pop_gridSort_user: SortDescriptor[] = [];
  public pop_gridSelection_user: any[] = [];


  public pop_selectbox_list = [
    // new SelectBox('1', 'USA' ),
    // new SelectBox('2', 'India' ),
    // new SelectBox('4', 'Brazil'),
    // new SelectBox('3', 'Australia' )
  ];
  public pop_select_user: any[];


  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private mlangService: MlangService
  ) {

    this.serachTree_dept();
    this.searchGrid_role();
  }

  ngOnInit() {
  }

  private serachTree_dept() {
    // this.jsonApiService.fetch(`/_test/dept1.json`)
    //   .subscribe((jsonData: any) => {
    //     this.data_tree = jsonData;
    //   })
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
    }];
    this.pmsApiService.fetch('deptlist/dept', param).subscribe(result => {
      if (result.code == "00") {
        this.data_tree = JSON.parse(result.data);
      } else {
        alert("오류 리스트_main");
      }
    })
  }
  public treeSelection(event: any): void {
    this.tree_id = event.dataItem.id;
    this.searchGrid_info();
  }






  private searchGrid_role(): void {
    // this.jsonApiService.fetch(`/_test/grid1.json`)
    //   .subscribe((jsonData: any) => {
    //     this.gridData_role = jsonData;
    //     this.loadGrid_role();
    //     //this.pageSize_role = jsonData.length;
    //   })
    let param = [{
    //lang_lcid: "1042", company_cd: "COLLABRA"
    }];
    this.pmsApiService.fetch('rolelist/role', param).subscribe(result => {
      if (result.code == "00") {
        this.gridData_role = result.data;
        this.loadGrid_role();
      } else {
        alert("오류 역할리스트");
      }
    })
  }

  private loadGrid_role(): void {
    this.gridView_role = {
      data: orderBy(this.gridData_role, this.gridSort_role),
      total: this.gridData_role.length
    };
  }

  public sortChange_role(sort: SortDescriptor[]): void {
    this.gridSort_role = sort;
    this.loadGrid_role();
  }

  private onSelectedKeysChange_role(event) {
    //this.mySelection 키로 해당 그리드 모든 정보 찾기
    for (let i = 0; i < this.gridData_role.length; i++) {
      if (this.gridData_role[i].role_id == this.gridSelection_role) {
        console.log(this.gridData_role[i]);
        this.role_nm = this.gridData_role[i].role_nm;
        break;
      }
    }
    this.role_id = this.gridSelection_role.toString();
    this.searchGrid_info();

  }







  private searchGrid_info(): void {
    // alert("role_id=" + this.role_id + ", tree_id=" + this.tree_id + "----------------[DB연동-상세정보 조회]");
    // this.jsonApiService.fetch(`/_test/grid2.json`)
    //   .subscribe((jsonData: any) => {
    //     this.gridData_info = jsonData;
    //     this.loadGrid_info();
    //     //this.pageSize_role = jsonData.length;
    //   })
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
       role_id : this.role_id
      , dept_cd : this.tree_id
    }];
    this.pmsApiService.fetch('roleassignuser/role_emp', param).subscribe(result => {
      console.log(result.data);
       this.gridData_info = result.data;
       this.loadGrid_info();
    })
  }

  private loadGrid_info(): void {
    this.gridView_info = {
      data: orderBy(this.gridData_info, this.gridSort_info),
      total: this.gridData_info.length
    };
  }

  public sortChange_info(sort: SortDescriptor[]): void {
    this.gridSort_info = sort;
    this.loadGrid_info();
  }





  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  click_add(tp) {
    if (this.role_id == "") {
      let ret_tit = this.mlangService.getTranslation('역할', 'LABEL', 'L000068', '37');
      let ret_msg = this.mlangService.getTranslation('역할을 선택하세요.', 'MSG', 'M000013', '37');

      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }
    this.lgModal_add.show();
    this.pop_search_user()
  }


  public pop_search_user() {
    //alert("role_id=" + this.role_id + "----------------[DB연동-역학별 등록정보 조회]");
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
       role_id : this.role_id
      , dept_cd : ""
    }];
    this.pmsApiService.fetch('roleassignuser/role_emp', param).subscribe(result => {
      this.pop_selectbox_list = [];

       for (let i = 0; i < result.data.length; i++) {
           this.pop_selectbox_list.push(new SelectBox(result.data[i].emp_no, result.data[i].emp_nm))
       }
    })
  }




  public pop_treeSelection(event: any): void {
    this.pop_tree_id = event.dataItem.id;
    this.pop_searchGrid_user();
  }



  private pop_searchGrid_user(): void {
    //alert("pop_tree_id=" + this.pop_tree_id + ", pop_user_nm=" + this.pop_user_nm + "----------------[DB연동-팝업사원명]");
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
       dept_cd : this.pop_tree_id
      , emp_nm : this.pop_user_nm
    }];
    this.pmsApiService.fetch('roleassignuser/deptinuser', param).subscribe(result => {
       this.pop_gridData_user = result.data;
       this.pop_loadGrid_user();
    })
    // this.jsonApiService.fetch(`/_test/grid3.json`)
    //   .subscribe((jsonData: any) => {
    //     this.pop_gridData_user = jsonData;
    //     this.pop_loadGrid_user();
    //     //this.pageSize_role = jsonData.length;
    //   })
  }

  private pop_loadGrid_user(): void {
    this.pop_gridView_user = {
      data: orderBy(this.pop_gridData_user, this.pop_gridSort_user),
      total: this.pop_gridData_user.length
    };
  }

  public pop_sortChange_dept(sort: SortDescriptor[]): void {
    this.pop_gridSort_user = sort;
    this.pop_loadGrid_user();
  }

  public hiddenColumns: string[] = ['emp_no'];
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }





  public pop_add_user(): void {
    for (let i = 0; i < this.pop_gridSelection_user.length; i++) {
      for (let j = 0; j < this.pop_gridData_user.length; j++) {
        if (this.pop_gridData_user[j].emp_no == this.pop_gridSelection_user[i]) {
          let chk: boolean = false;

          this.pop_selectbox_list.forEach((item, index) => {
            if (item.id === this.pop_gridData_user[j].emp_no) {
              chk = true;
            }
          });

          if (chk == false) {
            this.pop_selectbox_list.push(new SelectBox(this.pop_gridData_user[j].emp_no, this.pop_gridData_user[j].emp_nm));
          }
        }
      }
    }

  }

  public pop_del_user(): void {
    for (let i = 0; i < this.pop_select_user.length; i++) {
      this.pop_selectbox_list.forEach((item, index) => {
        if (item.id === this.pop_select_user[i]) {
          this.pop_selectbox_list.splice(index, 1);
        }
      });
    }
  }

  public pop_all_del_user(): void {
    this.pop_selectbox_list = [];
  }

  public pop_savedata(): void {
    let result : string = "";

    this.pop_selectbox_list.forEach((item, index) => {
      result += item.id + ",";
    });

    //alert("emp_no=" + result + " role_id=" + this.role_id  + "----------------[DB연동-팝업 정보 저장]");
    let param = [{
       company_cd: "COLLABRA"
      , role_id : this.role_id
      , emp_no : result
    }];
    this.pmsApiService.fetch('roleassignuser/role_emp', param, "put").subscribe(result => {
       //this.pop_gridData_user = result.data;
       //this.pop_loadGrid_user();
       if (result.code == "00") {
         this.searchGrid_info();
         this.lgModal_add.hide();
     } else {
       alert("오류 - 권한등록")
     }
    })
  }

}
