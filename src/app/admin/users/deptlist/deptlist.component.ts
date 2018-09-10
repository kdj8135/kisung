import { Component, ApplicationRef, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { JsonApiService } from "../../../core/api/json-api.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { MlangService} from "../../../shared/mlang/mlang.service";

declare var $: JQueryStatic;
import 'jqueryui';



@Component({
  selector: 'app-deptlist',
  templateUrl: './deptlist.component.html',
  styleUrls: ['./deptlist.component.css']
})
export class DeptlistComponent implements OnInit {
  public data_tree: any[];
  public tree_id: String;
  public tree_nm: String;

  public add_tp: String;
  public add_dept_nm: String;


  constructor(
    private jsonApiService: JsonApiService
    , private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private elRef: ElementRef
    , private mlangService: MlangService

  ) {
    this.serachTree_Dept();
  }

  public uploadFile;
  uploadFilesNm(fileList: any[]) {
    if (fileList.length > 0) {
      this.uploadFile = fileList.join("¿");
    } else {
      this.uploadFile = [];
    }
  }


  ngOnInit() {
  }
  private serachTree_Dept() {
    // this.jsonApiService.fetch( `/_test/dept1.json` )
    //   .subscribe((jsonData:any)=> {
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

  public handleSelection(event: any): void {
    //this.fetch_info(event.dataItem.id);
    //alert(event.dataItem.id);
    this.tree_id = event.dataItem.id;
    this.tree_nm = event.dataItem.text;
  }

  private fetch_info(id: string) {
    this.tree_id = id;
    alert("tree_id=" + this.tree_id + "----------------[DB연동-등록정보 조회]");
    this.jsonApiService.fetch(`/_test/dept2.json`)
      .subscribe((jsonData: any) => {
        for (let obj of jsonData) {
          for (let key in obj) {
            //console.log("key : " + key + ",  value : ", obj[key]);
            this[key] = obj[key];
          }
        }
      })
  }

  @ViewChild('lgModal_edit') public lgModal_edit: ModalDirective;
  click_edit(event) {
    if (this.tree_id == undefined) {
      let ret_tit = this.mlangService.getTranslation('부서명', 'LABEL', 'L000088', '41');
      let ret_msg = this.mlangService.getTranslation('부서를 선택하세요.', 'MSG', 'M000014', '41');

      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    this.lgModal_edit.show();
  }

  savedata_edit() {
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
       emp_no: "admin"
      , dept_cd: this.tree_id
      , dept_nm: this.tree_nm
      , attach_tp: "DEPT"
      , attach_files: this.uploadFile
    }];

    this.pmsApiService.fetch('deptlist/dept', param, "patch").subscribe(result => {
      if (result.code == "00") {
        this.lgModal_edit.hide();
        this.serachTree_Dept();
      } else {
        alert("오류 수정");
      }
    })
  }

  click_delete() {
    let ret_tit = "";
    let ret_msg = "";

    if (this.tree_id == undefined) {
      ret_tit = this.mlangService.getTranslation('부서명', 'LABEL', 'L000088', '41');
      ret_msg = this.mlangService.getTranslation('부서를 선택하세요.', 'MSG', 'M000014', '41');

      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    ret_tit = this.mlangService.getTranslation('삭제하시겠습니까?', 'MSG', 'M000015', '41');
    ret_msg = this.mlangService.getTranslation('하위부서가 존재하면, 하위부서까지 삭제됩니다.', 'MSG', 'M000016', '41');

    this.notificationService.smartMessageBox({
      title: ret_tit,
      content: ret_msg,
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        //alert("id=" + this.tree_id + "----------------[DB연동-삭제]");
        let param = [{
          // lang_lcid: "1042"
          // , company_cd: "COLLABRA"
           emp_no: "admin"
          , dept_cd: this.tree_id
          , dept_nm: this.add_dept_nm
          , add_tp: this.add_tp
        }];

        this.pmsApiService.fetch('deptlist/del_dept', param, "patch").subscribe(result => {
          if (result.code == "00") {
            this.serachTree_Dept();
          } else {
            this.notificationService.smallBox({
              title: "삭제할 수 없습니다.",
              content: "삭제할 부서(하위포함)로 참여된 사용자가 존재합니다.",
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



  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;
  click_add(tp) {
    if (this.tree_id == undefined) {
      let ret_tit = this.mlangService.getTranslation('부서명', 'LABEL', 'L000088', '41');
      let ret_msg = this.mlangService.getTranslation('부서를 선택하세요.', 'MSG', 'M000014', '41');
      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }

    this.add_tp = tp;
    this.lgModal_add.show();
  }

  savedata_add() {
    let param = [{
      // lang_lcid: "1042"
      // , company_cd: "COLLABRA"
       emp_no: "admin"
      , dept_cd: this.tree_id
      , dept_nm: this.add_dept_nm
      , add_tp: this.add_tp
    }];

    this.pmsApiService.fetch('deptlist/dept', param, "put").subscribe(result => {
      if (result.code == "00") {
        this.lgModal_add.hide();
        this.serachTree_Dept();
        this.add_dept_nm = "";
      } else {
        alert("오류 등록");
      }
    })
  }

  submitted = false;
  onSubmit() {

    //this.submitted = true;
    console.log('submitted')
  }

  modal_seq: number = 0;
  modal_top: number = 0;
  modal_height : number = 300;
  edit_test(type: string) {

    if (this.tree_id == undefined) {
      let ret_tit = this.mlangService.getTranslation('부서명', 'LABEL', 'L000088', '41');
      let ret_msg = this.mlangService.getTranslation('부서를 선택하세요.', 'MSG', 'M000014', '41');

      this.notificationService.smallBox({
        title: ret_tit,
        content: ret_msg,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }


    this.modal_seq += 1;
    this.modal_top += 30;

    let html_button = `<button id="btn_open_` + this.modal_seq.toString() + `" style="display:none;"  data-toggle="modal"
              data-backdrop="false" data-target="#target_` + this.modal_seq.toString() + `">Open Modal</button>`;
    $("#hidden_button").append(html_button);

    let html_modal = `
             <div _ngcontent-c1 id="target_` + this.modal_seq.toString() + `" class="modal">
               <div _ngcontent-c1 class="modal-dialog">
                 <div _ngcontent-c1 class="modal-content modalHeight">

                   <div _ngcontent-c1 class="modal-header">
                     <h4 _ngcontent-c1 class="modal-title">수정</h4>
                   </div>

                   <div _ngcontent-c1 class="modal-body">
                     <div class="row">
                       <div class="col-md-6">
                         <div class="form-group">
                           <label>부서코드</label>
                           <input type="text" class="form-control" id="edit_dept_cd_` + this.modal_seq.toString() + `" disabled="disabled" value="` + this.tree_id + `">
                         </div>
                       </div>
                       <div class="col-md-6">
                         <div class="form-group">
                           <label>부서명</label>
                           <input type="text" class="form-control" id="edit_dept_nm_` + this.modal_seq.toString() + `" value="` + this.tree_nm + `">
                         </div>
                       </div>
                     </div>
                   </div>

                   <div _ngcontent-c1 class="modal-footer">
                     <button _ngcontent-c1 type="button" id="btn_save_` + this.modal_seq.toString() + `" class="btn btn-primary">추가</button>
                     <button _ngcontent-c1 type="button" id="btn_close_` + this.modal_seq.toString() + `" class="btn btn-default">취소</button>
                   </div>

                 </div>
               </div>
             </div>
   `;
    $("#hidden_modal").append(html_modal);

    //this가 jquery와 곂치기 때문에 하나 복사
    let _this = this;
    //팝업 강제 오픈
    $("#btn_open_" + this.modal_seq.toString()).click();

    //팝업 저장
    $("#btn_save_" + this.modal_seq.toString()).bind('click', function() {
      let key = this.id.split("_")[2];
      let param = [{
        // lang_lcid: "1042"
        // , company_cd: "COLLABRA"
         emp_no: "admin"
        , dept_cd: $("#edit_dept_cd_" + key).val()
        , dept_nm: $("#edit_dept_nm_" + key).val()
        , attach_tp: "DEPT"
        , attach_files: _this.uploadFile
      }];

      _this.pmsApiService.fetch('deptlist/dept', param, "patch").subscribe(result => {
        if (result.code == "00") {
          //팝업 닫기
          $("#btn_open_" + key).click();
          _this.serachTree_Dept();
        } else {
          alert("오류 수정");
        }
      })
    });

    //팝업 닫기
    $("#btn_close_" + this.modal_seq.toString()).bind('click', function() {
      $("#btn_open_" + this.id.split("_")[2]).click();
    });

    $(".modal").draggable({handle: ".modal-header"});
    $(".modal-dialog").css({"margin-right": "0px","margin-left": "0px"});

    $("#target_" + this.modal_seq.toString()).css({"top": _this.modal_top + "px","left": "33%", "overflow-y": "hidden", "height": _this.modal_height + "px"});
  }
}
