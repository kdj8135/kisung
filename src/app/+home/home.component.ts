import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalsVariable } from '../shared/helpers/index';
import { WindowRef } from '../shared/helpers/index';
import { PmsApiService } from "../core/api/pms-api.service";
import { RecentProjectsService } from "../shared/layout/header/recent-projects/recent-projects.service";

import { JsonApiService } from "../core/api/json-api.service"; //첫번째 그래프
import { FakeDataSource } from "./flot-examples"; //첫번째 그래프
import * as examples from "./flot-examples" //첫번째 그래프

declare var $: JQueryStatic;
import 'jqueryui';

import { Location } from '@angular/common';
import { Router } from '@angular/router';


import * as XLSX from 'ts-xlsx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
nativeWindow: any
  navigationSubscription;
  sel_status;
  sel_order_tp;
  public order_tps: Array<any>;
  constructor(
    private glObj: GlobalsVariable
    , private winRef: WindowRef
    , private pmsApiService: PmsApiService
    , private projectsService: RecentProjectsService
    , private location: Location
    , private router: Router
    , private jsonApiService: JsonApiService //첫번째 그래프
  ) {
    console.log("glClickMenuId : " + this.glObj.getClickMenuId());
    this.nativeWindow = winRef.getNativeWindow();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      //alert(1);
    });
  }

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }

  public charData;
  ngOnInit() {
    this.sel_status = "N";
    this.sel_order_tp = "AD00005_0001";

    //공통코드-수주관리 구분
    let param = [{
      main_cd: "AD00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.order_tps = result.data;
    });

    this.searchChart();
  }

  searchChart() {

    let param = [{
      emp_no:"admin"
      ,status : this.sel_status
      ,order_tp : this.sel_order_tp
    }];

    console.log(param);
    this.charData = null;
    this.pmsApiService.fetch('alarm/chart_list', param).subscribe(result => {
        this.charData = result.data;
        //console.log(this.charData);
    });
  }

  ngOnDestroy() {
  }

  newWindow() {
    var newWindow = this.nativeWindow.open('/#/link', "_blank", "toolbar=1, scrollbars=1, resizable=1");
    newWindow.location = '/#/popup/users/userlist';
  }

  reloadPage() {
    location.reload();
  }

  reloadPage2() {
    //this.router.navigateByUrl(this.router.url);
    console.log(this.router)
    alert(1);
    this.router.navigate([this.router.url], { queryParams: this.getQUeryParams() });
    alert(2);
  }

  getQUeryParams() {
    let queryParams: any = {};
    queryParams = 1;
    //http://queryParams.st = Number(new Date());
    return queryParams;

  }


  //업로드타입
  attach_tp = "TEST";
  //조회정보(신규일때는 없을것이고 수정일때는 존재, 조회를 위해 1로 저장)
  //자바에서 1로 저장하고 있음.
  paper_id = "1";
  //저장시 넘길 파일정보
  uploadFile;
  uploadFilesNm(fileList: any[]) {
    if (fileList.length > 0) {
      this.uploadFile = fileList.join("¿");
    } else {
      this.uploadFile = [];
    }
  }
  savedata_file() {
    //파일 업로드시 아래 tp, files, 작성자는 필수, id는 수정시에는 있고 등록시는 없을것
    let param = [{
      attach_tp: this.attach_tp
      , attach_files: this.uploadFile
      , paper_id: this.paper_id
      , emp_no: "admin"
    }];
    //저장시 기존 넘기는 정보에 위 파라미터 넘겨줘야 함
    //그 이후에 자바에서 소스 추가 필요

    this.pmsApiService.fetch('testuploadfile', param).subscribe(result => {
      if (result.code == "00") {
      } else {
        alert("오류 수정");
      }
    })
  }

  modal_seq: number = 0;
  modal_top: number = 0;
  modal_height: number = 300;
  modal_test(type: string) {
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
            <h4 _ngcontent-c1 class="modal-title">모달타이틀</h4>
          </div>

          <div _ngcontent-c1 class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>모달본문1</label>
                  <input type="text" class="form-control" id="edit_dept_cd_` + this.modal_seq.toString() + `" disabled="disabled" value="` + this.modal_seq + `">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>모달본문2</label>
                  <input type="text" class="form-control" id="edit_dept_nm_` + this.modal_seq.toString() + `" value="` + this.modal_seq + `">
                </div>
              </div>
            </div>
          </div>

          <div _ngcontent-c1 class="modal-footer">
            <button _ngcontent-c1 type="button" id="btn_save_` + this.modal_seq.toString() + `" class="btn btn-primary">저장</button>
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
      alert(key + "_저장");
      $("#btn_open_" + key).click();
    });

    //팝업 닫기
    $("#btn_close_" + this.modal_seq.toString()).bind('onclick', function() {
      $("#btn_open_" + this.id.split("_")[2]).click();
    });

    $(".modal").draggable({ handle: ".modal-header" });
    $(".modal-dialog").css({ "margin-right": "0px", "margin-left": "0px" });

    $("#target_" + this.modal_seq.toString()).css({ "top": _this.modal_top + "px", "left": "33%", "overflow-y": "hidden", "height": _this.modal_height + "px" });
  }

  project_add() {
    let project = [{ "title": "프로젝트5", "projectid": 5 }];
    this.projectsService.addProjects(project);
  }

  projectinfo = "";
  project_get() {
    let info = this.projectsService.getProjects_info();
    this.projectinfo = "";
    this.projectinfo += "ID:" + info.projectid;
    this.projectinfo += ", TITLE:" + info.title;
  }

  project_move() {
    let project = [{ "title": "프로젝트2", "projectid": 2 }];
    this.projectsService.setproject(project);
  }

  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }
  excel_json: string[];
  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.excel_json = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    }
    fileReader.readAsArrayBuffer(this.file);
  }

}
