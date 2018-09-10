import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { UploadEvent, RemoveEvent, FileInfo } from '@progress/kendo-angular-upload';

import { FileState } from '@progress/kendo-angular-upload';

import { pmsConfig } from '../shared/pms.config';
import { UserService } from "../shared/user/user.service";

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { delay } from 'rxjs/operators/delay';
import { PmsApiService } from "../core/api/pms-api.service";

import { OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges } from '@angular/core';

import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';

export class GetmyFiles {
  constructor(public name: string, public size: number) { }
}

@Component({
  selector: 'app-fileattach',
  template: `
  <kendo-upload
    #myUpload="kendoUpload"
    [(ngModel)]="myFiles"
    [withCredentials]="false"
    [saveUrl]="uploadSaveUrl"
    [removeUrl]="uploadRemoveUrl"
    [autoUpload]="true"

    (upload)="uploadEventHandler($event)"
    (remove)="removeEventHandler($event)"
    >

    <kendo-upload-messages select="파일 선택"></kendo-upload-messages>

    <ng-template kendoUploadFileTemplate let-files let-state="state">
        <div style="cursor:pointer" (click)="filedown(files[0])"><u>{{files[0].name}} ({{files[0].size}}bytes)</u></div>
        <button *ngIf="bShow"
            (click)="remove(myUpload, files[0].uid)"
            class="k-button" style="position: absolute; right: .2em;">
            Remove
        </button>
     </ng-template>
  </kendo-upload>
  `
})
export class FileAttachComponent implements OnInit, DoCheck {
  constructor(
    private userService: UserService,
    private pmsApiService: PmsApiService) {
    this.user = userService.getLoginInfo();
  }

  @Input() name: string;
  @Input() paper_id: string;
  @Input() sub_id: string;
  @Input() rev: string;
  @Input() view_yn: string;
  org_id: string;
  bShow = false;
  uploadSaveUrl = "";
  uploadRemoveUrl = "";
  user: any;
  filelist = [];
  myFiles: Array<FileInfo> = [];

  ngOnInit() {

  }

  ngDoCheck() {
    if ((this.view_yn || "") == "Y") {
      this.myUpload.wrapper.firstElementChild.style.display = "none";
      this.bShow = false;
    } else {
      this.myUpload.wrapper.firstElementChild.style.display = "";
      this.bShow = true;
    }

    if (this.paper_id != undefined) {
      if (this.org_id == "" || this.org_id == undefined) {
        this.org_id = this.paper_id;
        this.filelist = [];
        this.searchfile();
      } else {
        if (this.org_id != this.paper_id) {
          this.org_id = this.paper_id;
          this.filelist = [];
          this.searchfile();
        }
      }
    }

    this.getFileList();
  }

  @Output() uploadFilesNm = new EventEmitter();

  getFileList() {
    this.uploadFilesNm.emit("");
    this.uploadFilesNm.emit(this.filelist);
  }

  @ViewChild('myUpload') public myUpload;
  uploadEventHandler(e: UploadEvent) {
    if (!this.user) this.user = this.userService.getLoginInfo();

    this.myUpload.saveUrl = this.getBaseUrl() + "fileupload?company_cd=" + this.user.companyCd + "&attach_tp=" + this.name + "&emp_no=" + this.user.empId;

    this.filelist.push(e.files[0].name);
    this.getFileList();
  }

  removeEventHandler(e: RemoveEvent) {
    if (!this.user) this.user = this.userService.getLoginInfo();
    let filenm = e.files[0].name;
    this.myUpload.removeUrl = this.getBaseUrl() + "filedelete?attach_tp=" + this.name + "&emp_no=" + this.user.empId + "&filenm=" + filenm;

    this.filelist.forEach((item, index) => {
      if (item === filenm) {
        this.filelist.splice(index, 1);
      }
    });

    this.getFileList();
  }

  public remove(upload, uid: string) {
    upload.removeFilesByUid(uid);
  }

  public showButton(state: FileState): boolean {
    return (state === FileState.Uploaded) ? true : false;
  }

  private searchfile() {
    if (!this.user) this.user = this.userService.getLoginInfo();

    let param = [{
      attach_tp: this.name
      , paper_id: this.org_id
      , sub_id : (this.sub_id || "")
      , rev : (this.rev || "")
      , emp_no : this.user.empId
    }];
    this.pmsApiService.fetch('fileserach', param).subscribe(result => {
      if (result.code == "00") {
        this.myFiles = [];
        for (let i = 0; i < result.data.length; i++) {
          this.myFiles.push({
            name: result.data[i].FILE_NM
            , size: result.data[i].FILE_SIZE
            , extension: result.data[i].FILE_EXT
            , state: 1
            , uid: i.toString()
          });

          this.filelist.push(result.data[i].FILE_NM);
        }

        this.getFileList();
      } else {
        alert("오류 리스트_main");
      }
    })
  }

  filedown (file : FileInfo) {
    if (!this.user) this.user = this.userService.getLoginInfo();

    const url = this.getBaseUrl() + "filedown";
    const dataURI = "data:multipart/form-data;";

    const file_nm = this.user.companyCd + "//" + this.name + "//" + this.user.empId + "//" + file.name;
    saveAs(dataURI, file_nm, {
       forceProxy: true,
       proxyURL: url,
       proxyData: {
          '__RequestVerificationToken': 'xyz'
       }
      });
  }
  private getBaseUrl() {
    return pmsConfig.Protocol + '://' + pmsConfig.Hostname + (pmsConfig.Port ? ':' + pmsConfig.Port : '') + '/'
  }


}
