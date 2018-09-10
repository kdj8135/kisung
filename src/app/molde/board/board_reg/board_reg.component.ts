import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationService} from "../../../shared/utils/notification.service";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService} from "../../../shared/user/user.service";
import { ModalDirective} from "ngx-bootstrap";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query'; //그리드
import { GridDataResult } from '@progress/kendo-angular-grid';//그리드
import { MlangService} from "../../../shared/mlang/mlang.service";

//declare var $: JQueryStatic;
// import 'jqueryui';

@Component({
  selector: 'app-board-reg',
  templateUrl: './board_reg.component.html',
})

//export class Userlist_regComponent implements OnInit {
export class board_regComponent implements OnInit {
  @Input() idx: string = "";
  @Output() close_hide_reg = new EventEmitter(); //화면의 닫기버튼 호출용
  @Output() close_refresh_reg = new EventEmitter(); //등록창 닫기
  HideModal_Reg(){
    this.close_hide_reg.emit('this is a test');
  }
  opener_refresh_call(){
    this.close_refresh_reg.emit('test');
  }

  user:any;
  private SUBJECT : string;
  private summernote : string;
  private EMP_NO : string;

  //첨부파일
  public attach_tp_boardreg: String = "BOARD_REG";
  public paper_id: String;
  public file_view_yn: string = "N";

  constructor(
    private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private userService: UserService
    , private mlangService: MlangService
  ){
      this.user = this.userService.getLoginInfo()
  }

  public uploadFile_Board;
  uploadFilesNm_Board(fileList: any[]) {
    if (fileList.length > 0) {
      this.uploadFile_Board = fileList.join("¿");
    } else {
      this.uploadFile_Board = [];
    }
  }

  ngOnInit() {

  }

  ngOnChanges() {

    if(this.idx == ""){
      this.SUBJECT = "";
      this.paper_id = "0";
    }
    else{
      this.paper_id = this.idx;
      this.Data_Load();
    }

  }

  private Data_Load() {
    let param = [{ lang_lcid: "1042", company_cd: "COLLABRA"
    , board_no : this.idx}];

    this.pmsApiService.fetch('board/board_view', param).subscribe(result => {
      if(result.data.length > 0)
      {
        this.SUBJECT = result.data[0]["BOARD_SUBJECT"].toString()
        jQuery('#summernote').summernote('code', result.data[0]["BOARD_NOTE"].toString());        
      }

    })

  }

  save_Check(key, text): Boolean {
    let ret = true;
    if (this[key] == undefined || this[key] == "") {
      this.notificationService.smallBox({
        title: text + "을(를) 입력하세요.",
        content: "필수입력입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      ret = false;
    }
    return ret;
  }

  private Regsave():void {

    if (this.save_Check("SUBJECT", "제목") == false) return;
    if(!this.user) this.user = this.userService.getLoginInfo()
    //신규 추가
    if(this.idx == ""){
      let param = [{
        emp_no: this.user.empNo
        , subject: this.SUBJECT
        , note: jQuery('#summernote').summernote('code')
        , board_no: this.idx
        //첨부파일
        , attach_tp_boardreg: this.attach_tp_boardreg
        , attach_files_boardreg: this.uploadFile_Board
      }];
      this.pmsApiService.fetch('board/board_insert_update', param, "put").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh_call();
        } else {
          alert("등록오류");
        }
      })


    } else {
      //수정
      let param = [{
        emp_no: this.user.empNo
        , subject: this.SUBJECT
        , note: jQuery('#summernote').summernote('code')
        , board_no: this.idx
        //첨부파일
        , attach_tp_boardreg: this.attach_tp_boardreg
        , attach_files_boardreg: this.uploadFile_Board
      }];
      this.pmsApiService.fetch('board/board_insert_update', param, "put").subscribe(result => {
        if (result.code == "00") {
            this.opener_refresh_call();
        } else {
          alert("수정오류");
        }
      })

    }

  }



}
