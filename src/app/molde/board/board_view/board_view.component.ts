import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationService} from "../../../shared/utils/notification.service";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService} from "../../../shared/user/user.service";
import { ModalDirective} from "ngx-bootstrap";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query'; //그리드
import { GridDataResult } from '@progress/kendo-angular-grid';//그리드

@Component({
  selector: 'app-board-view',
  templateUrl: './board_view.component.html',
})
export class board_viewComponent implements OnInit {

  @Input() idx: string;
  @Output() close_hide_view = new EventEmitter(); //수정 버튼 클릭시 뷰창 닫고 등록창 오픈
  @Output() close_showEvent = new EventEmitter(); //닫기버튼 클릭시 뷰창 닫음
  @Output() close_refresh_view = new EventEmitter(); //삭제시 뷰창닫고 그리드 리로드
  HideModal_View(){
    this.close_hide_view.emit('this is a test');
  }
  opener_ShowRegModal(){
    this.close_showEvent.emit('this is a test');
  }
  opener_close_refresh(){
    this.close_refresh_view.emit('this is a test');
  }

  user: any;
  private inputcolor : string;
  private SUBJECT : string;
  private NOTE : string;
  //첨부파일
  public attach_tp_boardreg: String = "BOARD_REG";
  public paper_id: String;
  public file_view_yn: string = "Y";
  //수정,삭제버튼 권한
  confirm_disabled: boolean = true;

  constructor(
    private notificationService: NotificationService
    , private pmsApiService: PmsApiService
    , private userService: UserService,
  ){
    this.user = userService.getLoginInfo();
  }

  ngOnChanges  () {
    this.SUBJECT = "";
    this.NOTE = "";

    if(this.idx == "") this.paper_id = "0";
    else this.paper_id = this.idx;
    this.Data_View();
    this.inputcolor = "#eee";
  }

  ngOnInit() {

  }

  private ViewDelete() {
    let param = [{
      board_no: this.idx
      , attach_tp_boardreg: this.attach_tp_boardreg
    }];

    this.notificationService.smartMessageBox({
      title: "삭제하시겠습니까?",
      content: "",
      buttons: '[취소][삭제]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "삭제") {
        this.pmsApiService.fetch('board/board_list_delete', param, "put").subscribe(result => {
          if (result.code == "00") {
            this.opener_close_refresh(); //모달 닫기 및 그리드 리로드
          } else {
            alert("오류 삭제");
          }
        })
      }
      if (ButtonPressed === "취소") {

      }

    });
  }

  private Data_View() {
    let param = [{board_no : this.idx}];
    this.pmsApiService.fetch('board/board_view', param).subscribe(result => {
      if(result.data.length > 0)
      {
        let rgst_id = result.data[0]["RGST_ID"].toString();
        if(this.user.empId == rgst_id) this.confirm_disabled = false;

        this.SUBJECT = result.data[0]["BOARD_SUBJECT"].toString()
        jQuery("#board_view").html("");
        let html = result.data[0]["BOARD_NOTE"].toString();
        jQuery("#board_view").append(html);
      }

    })
  }



}
