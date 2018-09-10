import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotificationService } from "../../../shared/utils/notification.service";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-selectdept',
  templateUrl: './selectdept.component.html',
  styleUrls: ['./selectdept.component.css']
})
export class SelectdeptComponent implements OnInit {
  @Input() Arr_Cd_Nm: any[] = [];   //한화면에 부서등록이 여러개인경우 구분값
  @Input() Use_YN: string = "Y";          //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
  @Input() Expanded_YN: string = "Y";     //트리 펼침 Y = 모두다
  @Input() Pop_dept_cd: string = "";     //선택되어야할 부서코드
  @Output() selectdept_ok = new EventEmitter(); //등록창 닫기

  selectdept(){
    this.selectdept_ok.emit(this.arrdept);
  }
  @Output() selectdept_close = new EventEmitter(); //등록창 닫기
  closedept(){
    this.selectdept_close.emit('');
  }
  private dept_tree: any[];
  private dept_id: String;
  private dept_nm: String;
  private dept_parent_id: String;
  private arrdept: {};
  private expandedKeys: any[] = [];
  private selectedKeys: any[] = [];

  constructor(
     private notificationService: NotificationService
    , private pmsApiService: PmsApiService
  ) {

  }

  ngOnChanges() {
    //alert(this.Arr_Cd_Nm +"||"+this.Use_YN +"||"+this.Expanded_YN  +"||"+this.Pop_dept_cd)

    if(this.Expanded_YN == "Y") this.serachTree_Dept_expanded();
    this.serachTree_Dept();
  }

  ngOnInit() {
  }

  //트리전체 펼침 text 가져오기
  private serachTree_Dept_expanded() {

    //if (this.Use_YN == undefined) this.Use_YN = "Y";
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

    this.dept_nm = event.dataItem.text;
    this.dept_id = event.dataItem.id;
    this.dept_parent_id = event.dataItem.parentid;
    this.arrdept = {
      cd : this.Arr_Cd_Nm["cd"],
      nm : this.Arr_Cd_Nm["nm"],
      dept_id : this.dept_id,
      dept_nm : this.dept_nm,
      dept_parent_id : this.dept_parent_id
    }
    //this.selectdept();
  }

  private SelectOk(): void {
    this.selectdept();
  }

  public fetchChildren(node: any): Observable<any[]> {
      //return the parent node's items collection as children
      return of(node.items);
  }

  public hasChildren(node: any): boolean {
      //check if the parent node has children
      return node.items && node.items.length > 0;
  }

}
