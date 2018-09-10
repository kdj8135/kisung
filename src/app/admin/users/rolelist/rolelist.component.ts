import { Component, OnInit, ViewChild } from '@angular/core';

import { JsonApiService } from "../../../core/api/json-api.service";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { NotificationService } from "../../../shared/utils/notification.service";

import { ModalDirective } from "ngx-bootstrap";
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { of } from 'rxjs/observable/of';
import { CheckableSettings } from '@progress/kendo-angular-treeview';

import { PmsApiService } from "../../../core/api/pms-api.service";
import {DisplayitemService} from "../../../shared/_display/displayitem.service";

import { MlangService} from "../../../shared/mlang/mlang.service";

export class SelectBox {
  constructor(public id: string, public name: string) { }
}

@Component({
  selector: 'app-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.css']
})
export class RolelistComponent implements OnInit {
  public state: any = {
    tabs: 0
  };


  public gridData_role: any[];
  public gridView_role: GridDataResult;
  public gridSort_role: SortDescriptor[] = [];
  public gridSelection_role: any[] = [];

  public role_id: String = "";
  public role_nm: String = "";

  private editedRowIndex: number;
  public formGroup: FormGroup;

  public data_tree_main: any[];
  public tree_id_main: String = "";

  public data_tree_sub: any[];
  public tree_id_sub: String = "";

  public data_tree_dept: any[];
  public data_dept_chk: boolean = false;
  public tree_id_dept: String = "";
  public tree_nm_dept: String = "";

  public gridData_emp: any[];
  public gridView_emp: GridDataResult;
  public gridSort_emp: SortDescriptor[] = [];
  public gridSelection_emp: any[] = [];

  public pop_data_tree: any[];
  public pop_tree_ids: any[] = [];


  public selectbox_deptList = [
    //new SelectBox('1', 'USA' ),
    //new SelectBox('2', 'India' )
  ];
  public select_dept: any[];

  public selectbox_empList = [
    //new SelectBox('4', 'Brazil'),
    //new SelectBox('3', 'Australia' )
  ];
  public select_emp: any[];

  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , public displayitemService: DisplayitemService
    , private mlangService: MlangService
  ) {
    this.searchGrid_role();
    this.serachTree_dept();
  }

  ngOnInit() {
  }

  //역할목록 ------------------------------------start
  private searchGrid_role(): void {
    let param = [{  }];
    this.pmsApiService.fetch('rolelist/role', param).subscribe(result => {
      this.gridData_role = result.data;
      this.loadGrid_role();
    })

    // this.jsonApiService.fetch(`/_test/grid1.json`)
    //   .subscribe((jsonData: any) => {
    //     this.gridData_role = jsonData;
    //     this.loadGrid_role();
    //   })
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
        //console.log(this.gridData_role[i]);
        this.role_nm = this.gridData_role[i].role_nm;
        break;
      }
    }
    this.role_id = this.gridSelection_role.toString();
    this.serachTree_main();

    this.searchGrid_emp()
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'role_nm': new FormControl(dataItem.role_nm),
      'role_info': new FormControl(dataItem.role_info)
    });

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    let save_role_nm: String = formGroup.value.role_nm;
    let save_role_info: String = formGroup.value.role_info;

    if (save_role_nm == "") {
      let ret_tit = this.mlangService.getTranslation('역할명', 'LABEL', 'L000038', '35');
      let ret_msg = this.mlangService.getTranslation('은(는) 필수입니다.', 'MSG', 'M000007', '35');

      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_tit + ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    if (isNew == false) {
      let save_role_id: String = this.gridView_role.data[rowIndex].role_id;
      //alert("save_role_id=" + save_role_id + ", save_role_nm=" + save_role_nm + ", save_role_info=" + save_role_info + "----------------[DB연동-역할 수정]");

      let param = [{
         role_id: save_role_id
        , role_info: save_role_info
        , role_nm: save_role_nm
      }];
      this.pmsApiService.fetch('rolelist/role', param, "patch").subscribe(result => {
        if (result.code == "00") {
          this.closeEditor(sender, rowIndex);
          this.gridSelection_role = [];
          this.searchGrid_role();
        } else {
          alert("수정오류");
        }
      })
    } else {
      //alert("save_role_nm=" + save_role_nm + ", save_role_info=" + save_role_info + "----------------[DB연동-역할 추가]");
      let param = [{
        company_cd: "COLLABRA"
        , role_info: save_role_info
        , role_nm: save_role_nm
      }];
      this.pmsApiService.fetch('rolelist/role', param, "put").subscribe(result => {
        if (result.code == "00") {
          this.closeEditor(sender, rowIndex);
          this.gridSelection_role = [];
          this.searchGrid_role();
        } else {
          alert("등록오류");
        }
      })

    }
  }

  public removeHandler({ sender, rowIndex, dataItem }) {
    let ret_tit = this.mlangService.getTranslation('삭제하시겠습니까?', 'MSG', 'M000008', '35');

    this.notificationService.smartMessageBox({
      title: ret_tit,
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        this.closeEditor(sender);
        //alert("del_role_id=" + dataItem.role_id + "----------------[DB연동-역할 삭제]");
        let param = "/" + dataItem.role_id + "/COLLABRA";
        this.pmsApiService.fetch('rolelist/role', param, "delete").subscribe(result => {
          if (result.code == "00") {
            this.gridSelection_role = [];
            this.searchGrid_role();
          } else {
            this.notificationService.smallBox({
              title: "삭제할 수 없습니다.",
              content: "삭제할 역할로 참여된 사용자가 존재합니다.",
              color: "#C46A69",
              iconSmall: "fa fa-check fa-2x fadeInRight animated",
              timeout: 2000
            });
            return;
          }
        })
      }
      if (ButtonPressed === "취소") {
      }
    });



  }

  public addHandler({ sender }) {
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'role_nm': new FormControl(''),
      'role_info': new FormControl('')
    });

    sender.addRow(this.formGroup);
  }
  //역할목록 ------------------------------------end

  //화면트리 ------------------------------------start
  private serachTree_main() {
    let param = [{
      role_id : this.role_id
    }];
    this.pmsApiService.fetch('rolelist/tree_menu_detail', param).subscribe(result => {
      if (result.code == "00") {
        this.data_tree_main = JSON.parse(result.data);
        this.data_tree_sub = [];
      } else {
        alert("오류 리스트_main");
      }
    })
    //alert("role_id=" + this.role_id + "----------------[DB연동-역할별 권한관리 리스트_main]");
    // this.jsonApiService.fetch(`/_test/role_menu1.json`)
    //   .subscribe((jsonData: any) => {
    //     this.data_tree_main = jsonData;
    //   })
  }

  public treeSelection_main(event: any): void {
    this.selectbox_empList = [];
    this.selectbox_deptList = [];
    this.tree_id_main = event.dataItem.id;
    this.serachTree_sub();
  }

  private serachTree_sub() {
    // alert("role_id=" + this.role_id + "tree_id_main=" + this.tree_id_main + "----------------[DB연동-역할별 권한관리 리스트_sub]");
    // this.jsonApiService.fetch(`/_test/role_menu2.json`)
    //   .subscribe((jsonData: any) => {
    //     this.data_tree_sub = jsonData;
    //   })

    let param = [{
       menu_id_detail: this.tree_id_main
    }];
    this.pmsApiService.fetch('rolelist/tree_menu_event', param).subscribe(result => {
      if (result.code == "00") {
        this.data_tree_sub = JSON.parse(result.data);
      } else {
        alert("오류 리스트_sub");
      }
    })
  }

  public treeSelection_sub(event: any): void {
    this.tree_id_sub = event.dataItem.id;
    //alert("role_id=" + this.role_id + ", tree_id_main=" + this.tree_id_main + ", tree_id_sub=" + this.tree_id_sub + "----------------[DB연동-등록된 권한조회(개인, 조직도)]");
    this.selectbox_empList = [];
    this.selectbox_deptList = [];

    // this.selectbox_empList.push(new SelectBox('1', "김동진(전산팀)"));
    // this.selectbox_empList.push(new SelectBox('2', "김명현(전산팀)"));
    // this.selectbox_deptList.push(new SelectBox('0', "부서a"));
    let param = [{
       role_id: this.role_id
      , menu_id_detail: this.tree_id_main
      , menu_id_event: this.tree_id_sub
    }];

    this.pmsApiService.fetch('rolelist/role_event', param).subscribe(result => {
      if (result.code == "00") {
        console.log(result.data1);
        for (let i = 0; i < result.data1.length; i++) {
            this.selectbox_empList.push(new SelectBox(result.data1[i].id, result.data1[i].name))
        }

        for (let i = 0; i < result.data2.length; i++) {
            this.selectbox_deptList.push(new SelectBox(result.data2[i].id, result.data2[i].name))
        }
      }
    })

  }
  //화면트리 ------------------------------------end


  //선택 조직도------------------------------------start
  private serachTree_dept() {
    // this.jsonApiService.fetch(`/_test/dept1.json`)
    //   .subscribe((jsonData: any) => {
    //     this.data_tree_dept = jsonData;
    //   })
    let param = [{

    }];
    this.pmsApiService.fetch('deptlist/dept', param).subscribe(result => {
      if (result.code == "00") {
        this.data_tree_dept = JSON.parse(result.data);
      } else {
        alert("오류 조직도조회");
      }
    })
  }

  public chk_chg_dept($event: any) {
    this.data_dept_chk = $event.target.checked;
  }

  public treeSelection_dept(event: any): void {
    this.tree_id_dept = event.dataItem.id;
    this.tree_nm_dept = event.dataItem.text;
  }

  public add_dept(): void {
    let ret_tit = this.mlangService.getTranslation('권한등록', 'LABEL', 'L000049', '35');
    let ret_msg = this.mlangService.getTranslation('역할별화면-상세까지 선택하셔야 합니다.', 'MSG', 'M000009', '35');
    if (this.tree_id_sub == "") {
      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    let chk: boolean = false;
    let dept_id: String = this.tree_id_dept;
    let dept_nm: String = this.tree_nm_dept;
    if (this.data_dept_chk === true) {
      dept_id += "@" + "Y";
      dept_nm += "(하위부서)";
    } else {
      dept_id += "@" + "N";
    }

    this.selectbox_deptList.forEach((item, index) => {
      if (item.id.split("@")[0] === this.tree_id_dept) {
        chk = true;
        item.id = dept_id;
        item.name = dept_nm;
      }
    });

    if (chk == false) {
      this.selectbox_deptList.push(new SelectBox(dept_id.toString(), dept_nm.toString()));
    }
  }

  public del_dept(): void {
    for (let i = 0; i < this.select_dept.length; i++) {
      this.selectbox_deptList.forEach((item, index) => {
        if (item.id === this.select_dept[i]) {
          this.selectbox_deptList.splice(index, 1);
        }
      });
    }
  }

  public all_del_dept(): void {
    this.selectbox_deptList = [];
  }
  //선택 조직도------------------------------------end

  //선택 개인------------------------------------start
  private searchGrid_emp(): void {
    // alert("role_id=" + this.role_id + "----------------[DB연동-역할별 사용자 조회]");
    // this.jsonApiService.fetch(`/_test/grid2.json`)
    //   .subscribe((jsonData: any) => {
    //     //console.log(jsonData);
    //     this.gridData_emp = jsonData;
    //     this.loadGrid_emp();
    //     //this.pageSize_role = jsonData.length;
    //   })
    let param = [{
       role_id: this.role_id
      , dept_cd: ""
    }];
    this.pmsApiService.fetch('roleassignuser/role_emp', param).subscribe(result => {
      console.log(result.data);
      this.gridData_emp = result.data;
      this.loadGrid_emp();
    })
  }

  private loadGrid_emp(): void {
    this.gridView_emp = {
      data: orderBy(this.gridData_emp, this.gridSort_emp),
      total: this.gridData_emp.length
    };
  }

  public sortChange_emp(sort: SortDescriptor[]): void {
    this.gridSort_emp = sort;
    this.loadGrid_emp();
  }

  public hiddenColumns: string[] = ['emp_no'];
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public add_user(): void {
    let ret_tit = this.mlangService.getTranslation('권한등록', 'LABEL', 'L000049', '35');
    let ret_msg = this.mlangService.getTranslation('역할별화면-상세까지 선택하셔야 합니다.', 'MSG', 'M000009', '35');

    if (this.tree_id_sub == "") {
      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }
    for (let i = 0; i < this.gridSelection_emp.length; i++) {
      for (let j = 0; j < this.gridData_emp.length; j++) {
        if (this.gridData_emp[j].emp_no == this.gridSelection_emp[i]) {
          let chk: boolean = false;

          this.selectbox_empList.forEach((item, index) => {
            if (item.id === this.gridData_emp[j].emp_no) {
              chk = true;
            }
          });

          if (chk == false) {
            this.selectbox_empList.push(new SelectBox(this.gridData_emp[j].emp_no, this.gridData_emp[j].emp_nm + "(" + this.gridData_emp[j].dept_nm + ")"));
          }
        }
      }
    }
  }

  public del_user(): void {
    for (let i = 0; i < this.select_emp.length; i++) {
      this.selectbox_empList.forEach((item, index) => {
        if (item.id === this.select_emp[i]) {
          this.selectbox_empList.splice(index, 1);
        }
      });
    }
  }

  public all_del_user(): void {
    this.selectbox_empList = [];
  }

  //선택 개인 ------------------------------------end

  //권한저장 -----------------------------------start
  public click_save_auth() {

    let res_empList: string = "";
    let res_deptList: string = "";
    this.selectbox_empList.forEach((item, index) => {
      if (index > 0) res_empList += ",";
      res_empList += item.id;
    });

    this.selectbox_deptList.forEach((item, index) => {
      if (index > 0) res_deptList += ",";
      res_deptList += item.id;
    });

    if (this.tree_id_sub == "") {
      let ret_tit = this.mlangService.getTranslation('권한등록', 'LABEL', 'L000049', '35');
      let ret_msg = this.mlangService.getTranslation('등록할 데이터가 없습니다.', 'MSG', 'M000010', '35');

      this.notificationService.smallBox({
        title: ret_tit,
        content:ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    //   alert("role_id=" + this.role_id
    //     + ", tree_id_main=" + this.tree_id_main
    //     + ", tree_id_sub=" + this.tree_id_sub
    //     + ", emp_no=" + this.selectbox_empList
    //     + ", dept_cd=" + this.selectbox_deptList
    //     + "----------------[DB연동-권한 저장]");
    let param = [{
       role_id: this.role_id
      , menu_id_detail: this.tree_id_main
      , menu_id_event: this.tree_id_sub
      , emp_no: res_empList
      , dept_cd: res_deptList
    }];

    this.pmsApiService.fetch('rolelist/role_event', param, "put").subscribe(result => {
      //저장후 컨트롤에 대한 이벤트를 다시 호출
      this.displayitemService.initDisplayItem();
      this.notificationService.smallBox({
        title: "권한등록",
        content:"변경하였습니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;

    })
  }
  //권한저장 -----------------------------------end

  //팝업-메뉴추가 ------------------------------------start
  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  click_modal_menu(tp) {
    if (this.role_id == "") {
      let ret_tit = this.mlangService.getTranslation('권한등록', 'LABEL', 'L000049', '35');
      let ret_msg = this.mlangService.getTranslation('역할을 선택하세요.', 'MSG', 'M000011', '35');
      this.notificationService.smallBox({
        title: ret_tit,
        content:ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }
    this.pop_tree_ids = [];
    this.lgModal_add.show();

    let param = [{role_id: this.role_id }];

    this.pmsApiService.fetch('rolelist/pop_menu', param).subscribe(result => {
      this.pop_data_tree = JSON.parse(result.data);
      for (let i = 0; i < result.data2.length; i++) {
        this.pop_tree_ids.push(result.data2[i].menu_id);
      }
    })

    //alert("role_id=" + this.role_id + "----------------[DB연동-팝업 트리메뉴, 등록된 정보]");
    // this.jsonApiService.fetch(`/_test/role_menu3.json`)
    //   .subscribe((jsonData: any) => {
    //     console.log(jsonData);
    //     this.pop_data_tree = jsonData;
    //   })
    //이곳에 기존 등록된 내용을 입력한다.
    //this.pop_tree_ids = ['aa_2', 'cc_1'];
  }

  public children = (dataItem: any) => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  public pop_savedata(): void {
    //alert("role_id=" + this.role_id + ", menu_id=" + this.pop_tree_ids + "----------------[DB연동-팝업 메뉴저장]");
    let param = [{ company_cd: "COLLABRA", role_id: this.role_id, menu_id: this.pop_tree_ids }];
    this.pmsApiService.fetch('rolelist/pop_menu', param, "put").subscribe(result => {
      if (result.code == "00") {
        this.lgModal_add.hide();
        this.serachTree_main();
      } else {
        alert("메뉴등록 오류");
      }
    })

  }
  //팝업-메뉴추가 ------------------------------------end

}
