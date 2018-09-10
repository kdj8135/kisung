import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-roleassign',
  templateUrl: './roleassign.component.html',
  styleUrls: ['./roleassign.component.css']
})
export class RoleassignComponent implements OnInit {

  //트리 조직도
  private dept_tree: any[];
  private dept_cd: String;
  private expandedKeys: any[] = [];

  //그리드 인포 사용자
  private gridData_info: any[];
  private gridView_info: GridDataResult;
  private gridSort_info: SortDescriptor[] = [];
  private gridSelection_info: any[] = [];
  private emp_no: String = "";
  private emp_nm: String;
  private search_user_nm: String = "";

  //그리드 역할
  private gridData_role: any[];
  private gridView_role: GridDataResult;
  private gridSort_role: SortDescriptor[] = [];

  //팝업 역할 추가 그리드
  private pop_gridData_role: any[];
  private pop_gridView_role: GridDataResult;
  private pop_gridSort_role: SortDescriptor[] = [];

  //팝업 체크된 리스트 저장하기위해 임시로 담음
  private pop_selectbox_list = []
  //로드시 체크박스 체크 및 선택값
  private pop_gridSelection_role: any[] = [];

  constructor(
    private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private mlangService: MlangService
  ) {

    this.serachTree_Dept_expanded();
    this.serachTree_Dept();

  }

  ngOnInit() {
  }


  //트리조회-------------------------
  //트리전체 펼침 text 가져오기
  private serachTree_Dept_expanded() {

    let param = [{
      use_yn: "Y"
    }];
    this.pmsApiService.fetch('roleassign/roleAssign_TreeExpanded', param).subscribe(result => {
      if (result.code == "00") {

        //console.log(result.data);
        let arr_text = [];
        for (let obj of result.data) {
              arr_text.push(obj.text);
        }

        this.expandedKeys = arr_text;

      } else {
        alert("오류 리스트");
      }
    })

  }

  private serachTree_Dept() {

    let param = [{
      use_yn: "Y"
    }];
    this.pmsApiService.fetch('roleassign/roleAssign_Tree', param).subscribe(result => {
      if (result.code == "00") {

        this.dept_tree = JSON.parse(result.data);

      } else {
        alert("오류 리스트");
      }
    })
  }

  private treeSelection(event: any): void {
    this.emp_no = "";
    this.dept_cd = event.dataItem.id;

    this.searchGrid_info();
  }





  //사용자 그리드
  private searchGrid_info(): void {
    let param = [{
      dept_cd : this.dept_cd
      ,search_user_nm : this.search_user_nm
    }];

    this.pmsApiService.fetch('roleassign/roleAssign_info_emp', param).subscribe(result => {
       //console.log(result.data);
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

  private onSelectedKeysChange_info(event) {
    //this.mySelection 키로 해당 그리드 모든 정보 찾기
    for (let i = 0; i < this.gridData_info.length; i++) {
      if (this.gridData_info[i].emp_no == this.gridSelection_info) {
        this.emp_nm = this.gridData_info[i].emp_nm;
        break;
      }
    }

    this.emp_no = this.gridSelection_info.toString();

    this.searchGrid_role();

  }






  //역할확인 리스트
  private searchGrid_role(): void {
    let param = [{ emp_no: this.emp_no }];
    this.pmsApiService.fetch('roleassign/roleAssign_role', param).subscribe(result => {
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




  //모달
  @ViewChild('lgModal_addRole') public lgModal_addRole: ModalDirective;

  click_add(tp) {
    if (this.emp_no == "") {
      let ret_tit = this.mlangService.getTranslation('사용자', 'LABEL', 'L000056', '36');
      let ret_msg = this.mlangService.getTranslation('사용자를 선택하세요', 'MSG', 'M000012', '36');
      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }
    this.lgModal_addRole.show();
    this.pop_searchGrid_user()
  }

  private pop_searchGrid_user(): void {
    let param = [{
      emp_no: this.emp_no
    }];
    this.pmsApiService.fetch('roleassign/roleAssign_pop_role', param).subscribe(result => {
       this.pop_gridData_role = result.data;
       this.pop_loadGrid_user();

       let arr_role_id = [];
       for (let obj of result.data) {
         if(obj.select_chk == true)
         {
           arr_role_id.push(obj.role_id);
         }
       }
       this.pop_gridSelection_role = arr_role_id;
    })
  }

  private pop_loadGrid_user(): void {
    this.pop_gridView_role = {
      data: orderBy(this.pop_gridData_role, this.pop_gridSort_role),
      total: this.pop_gridData_role.length
    };
  }

  public pop_sortChange_role(sort: SortDescriptor[]): void {
    this.pop_gridSort_role = sort;
    this.pop_loadGrid_user();
  }



  public pop_add_role(): void {

    this.pop_selectbox_list = [];
    for (let i = 0; i < this.pop_gridSelection_role.length; i++) {
      for (let j = 0; j < this.pop_gridData_role.length; j++) {
        if (this.pop_gridData_role[j].role_id == this.pop_gridSelection_role[i]) {
          let chk: boolean = false;

          this.pop_selectbox_list.forEach((item, index) => {
            if (item.id === this.pop_gridData_role[j].role_id) {
              chk = true;
            }
          });

          if (chk == false) {
            this.pop_selectbox_list.push(new SelectBox(this.pop_gridData_role[j].role_id, this.pop_gridData_role[j].role_nm));
          }
        }
      }
    }

    let result : string = "";

    this.pop_selectbox_list.forEach((item, index) => {
      result += item.id + ",";
    });

    let param = [{
       company_cd: "COLLABRA"
      , emp_no : this.emp_no
      , role_id : result
    }];
    this.pmsApiService.fetch('roleassign/roleAssign_pop_role', param, "put").subscribe(result => {
       //this.pop_gridData_role = result.data;
       //this.pop_loadGrid_user();
       if (result.code == "00") {
         this.searchGrid_role();
         this.lgModal_addRole.hide();
     } else {
       alert("오류 - 권한등록")
     }
    })

  }

}
