import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { PmsApiService } from "../../../core/api/pms-api.service";
import { UserService } from "../../../shared/user/user.service";
import { NotificationService } from "../../../shared/utils/notification.service";
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

//180830 확정된 공정은 삭제 불가
//버튼 권한처리 하도록 변경 역할관리에서 체크
//P_WORK_TYPE = MY 나의 공정인 경우에만 확정인경우 disabled 처리함 다른화면에서 팝업시 수정할 수 있어야함.

@Component({
  selector: 'app-product-work-view',
  templateUrl: './product_work_view.component.html',
  styleUrls: ['./product_work_view.component.css']
})
export class Product_Work_View_Component implements OnInit {
  //팝업전용 사용자선택 시작
  private Arr_Cd_Nm: {};
  private Use_YN : string;
  private Pop_dept_cd : string;
  private Expanded_YN : string;
  //팝업전용 끝

  //셀렉터 뷰전용 시작
  @Input() P_WORK_ID: string = "";      //공정IDX 키값
  @Input() P_WORK_TYPE: string = "";    //작업(WORK),외주(OUT),나의(MY) 어느 화면에서 팝업되었는지 알기위한 키
  @Input() P_WORK_MENU_ID: string = "";    //작업(42),외주(51),나의(52) 어느 화면에서 팝업되었는지 알기위한 키
  @Output() product_work_view_close = new EventEmitter(); //등록창 닫기
  @Output() product_work_view_refresh = new EventEmitter();
  closeview(){
    this.product_work_view_close.emit('');
  }
  closerefresh(){
    this.product_work_view_refresh.emit('');
  }
  //셀렉터 뷰전용 끝

  user: any;
  public PRODUCT_ID: string;
  public PRODUCT_WORK_ID: string;   //idx
  public ORDER_NO: string;          //수주번호
  public MAP_NO: string;            //도면번호
  public VENDOR_ID: string;         //업체번호
  public VENDOR_NM: string;         //업체이름
  public LARGE_CATEGOR_CD: string;  //대분류코드
  public PRODUCT_NO: string;        //품번
  public MATERIAL: string;          //재질
  public PRODUCT_NM: string;        //품명
  public SIZE: string;              //사이즈
  public GUBUN_CD: string;          //구분코드
  public PROGRESS_VOLUME: string;   //가공수량
  public VOLUME: string;            //총수량
  public PRODUCT_PROGRESS: string;  //제품진행여부
  public PROGRESS_CD: string;       //공정
  public FACILITIES_CD: string;     //설비
  public OUTSOURCING_CD: string;    //외주여부
  public WORKER_ID: string;         //작업자
  public WORKER_NM: string;         //작업자
  public OUTSOURCING_AMT: string;   //외주금액
  public REMARK: string;            //특이사항
  public S_WORK_DAY: string;        //작업시작일
  public S_WORK_DAY_INPUT: string;  //작업시작일 입력화면
  public S_WORK_DAY_VIEW: string;   //작업시작일 보기화면
  public S_WORK_TIME: string;       //작업시작시간
  public E_WORK_DAY: string;        //작업종료일
  public E_WORK_DAY_INPUT: string;  //작업종료일 입력화면
  public E_WORK_DAY_VIEW: string;   //작업종료일 보기화면
  public E_WORK_TIME: string;       //작업종료시간
  public WORK_TOT_MIN: string;      //작업시간 총분
  public WORK_TOT_HOUR: string;     //작업시간 총시간
  public SET_MIN: string;           //셋팅 분
  public SET_MANNED_MIN: string;    //유인 분
  public SET_MANLESS_MIN: string;   //무인 분
  public SET_RAW_MIN: string;       //미가공 분

  public READ_WORK_TOT_HOUR: string; //읽기전용 작업시

  public SET_HOUR: string;           //셋팅 분
  public SET_MANNED_HOUR: string;    //유인 분
  public SET_MANLESS_HOUR: string;   //무인 분
  public SET_RAW_HOUR: string;       //미가공 분

  public SET_TOT_MIN: string;       //가공시간 총분
  public SET_TOT_HOUR: string;      //가공시간 총시간

  public CONFIRM_YN: string;        //확정유무
  public WORK_PROCEDURE: string;    //작업지시사항

  @ViewChild('receive_dt') receive_dt: ElementRef; //입고마감일

  public SET_MANNED_CD: string;     //유인이유 셀렉트 박스
  public SET_RAW_CD: string;        //무인이유 셀렉트 박스

  public CHK_OK: string;            //자주 검사
  public CHK_ERROR: string;         //불량 확정

  //전역변수
  public set_manned_cd_list: Array<any>;     //유인 이유 리스트
  public set_raw_cd_list: Array<any>;        //무인 이유 리스트

  public large_categor_cd_list: Array<any>; //대분류
  public product_progress_list: Array<any>; //제품진행여부
  public progress_cd_list: Array<any>;      //공정
  public facilities_cd_list: Array<any>;    //설비
  public gubun_cd_list: Array<any>;         //구분
  public worker_list: Array<any>;           //사용자리스트
  public outsourcing_list: Array<any>;      //외주구분

  input_disabled: boolean = true;           //기본Road된 화면 disabled
  confirm_disabled: boolean = false;        //확정버튼클릭시 disabled 여부
  confirm_button_disabled: boolean = false; //확정여부를 알기위하여 확정시 disabled
  modal_title: string;                      //팝업타이틀 이름정의
  readonly_color: string = "#eee";          //리드온리인것들 색상 정의
  amt_readonly = false;                     //외주여부에 따라서 외주금액 readonly;
  amt_readonly_color = "";                  //외주여부에 따라서 외주금액 색상변

  chk_ok_error_disabled: boolean = false;    //자주검사,불량확정 여부 활성화
  chk_ok_error_color = "#eee";
  none_start = true;                       //선행공정이 끝나지 않으면 시작일자 종료일자 디저블
  none_start_color = "#eee";               //선행공정이 끝나지 않으면 시작일자 종료일자 색상변경
  constructor(
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user = userService.getLoginInfo();
  }

  ngOnInit() {

    //----------------------작업관리 등록창----------------------시작
    this.GUBUN_CD = "";       //초기값선택
    this.OUTSOURCING_CD = ""; //초기값선택
    //공통코드-대분류 구분
    let param = [{
      main_cd: "AD00007"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.large_categor_cd_list = result.data;
    });
    this.LARGE_CATEGOR_CD="";

    //업체리스트
    param = [{
      main_cd: "AD00008"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.product_progress_list = result.data;
    });
    this.PRODUCT_PROGRESS="";

    //공정리스트
    param = [{
      main_cd: "BS00005"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.progress_cd_list = result.data;
    });
    this.PROGRESS_CD="";

    //구분리스트
    param = [{
      main_cd: "AD00006"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.gubun_cd_list = result.data;
    });
    this.GUBUN_CD="";

    //외주구분
    param = [{
      main_cd: "BS00006"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.outsourcing_list = result.data;
    });
    this.OUTSOURCING_CD="";

    //유인 이유 리스트 구분
    param = [{
      main_cd: "AD00009"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.set_manned_cd_list = result.data;
    });
    this.SET_MANNED_CD="";

    //무인 이유 리스트 구분
    param = [{
      main_cd: "AD00010"
    }];
    this.pmsApiService.fetch('WPCommon/commoncode_2lvl', param).subscribe(result => {
      this.set_raw_cd_list = result.data;
    });
    this.SET_RAW_CD="";



    this.Data_Load();
    //----------------------작업관리 등록창----------------------끝
  }

  change_worker_list(val) {
    //BS00006_0001 사내 공정 작업 담당자
    //BS00006_0002 외주 AD00004_0002
    //BS00006_0003 구매 AD00004_0003
    //BS00006_0004 소재 AD00004_0004
    //BS00006_0005 면삭 AD00004_0008

    if(this.OUTSOURCING_CD != "")
    {
      let paramP = [{
        select_gubun: this.OUTSOURCING_CD
        ,select_progress: this.PROGRESS_CD
      }];
      this.pmsApiService.fetch('WPCommon/WPCommon_Worker', paramP).subscribe(result => {
        //console.log(result.data)
        this.worker_list = result.data;
      });

      if (val == "" || val == undefined)
      {
        this.WORKER_ID="";
      }
      {
        this.WORKER_ID = val;
      }
    }
    else{
      this.worker_list = null;
      this.WORKER_ID="";
    }

    if(this.OUTSOURCING_CD != "BS00006_0001" && this.OUTSOURCING_CD != "BS00006_0006")
    {
      this.amt_readonly = false;
      this.amt_readonly_color = "";
    }
    else{
      this.amt_readonly = true;
      this.amt_readonly_color = "#eee";
      this.OUTSOURCING_AMT = "";
      this.receive_dt.nativeElement.value = "";
    }
  }

  change_facilities_list(val) {
    if(this.PROGRESS_CD != "")
    {
      let paramP = [{
        main_cd: "BS00005"
        ,sub_cd: this.PROGRESS_CD
        ,lvl: "3"
      }];
      this.pmsApiService.fetch('WPCommon/commoncode_sublvl', paramP).subscribe(result => {
        //console.log(result.data)
        this.facilities_cd_list = result.data;
      });
      if (val == "")
      {
        this.FACILITIES_CD="";
      }
      {
        this.FACILITIES_CD = val;
      }

    }
  }

  ngOnChanges() {

    this.PRODUCT_ID = "";
    this.ORDER_NO = "";
    this.MAP_NO = "";
    this.VENDOR_ID = "";
    this.VENDOR_NM = "";
    this.LARGE_CATEGOR_CD = "";
    this.PRODUCT_NO = "";
    this.MATERIAL = "";
    this.PRODUCT_NM = "";
    this.SIZE = "";
    this.GUBUN_CD = "";
    this.PROGRESS_VOLUME = "";
    this.VOLUME = "";
    this.PRODUCT_PROGRESS = "";
    this.PROGRESS_CD = "";
    this.FACILITIES_CD = "";
    this.OUTSOURCING_CD = "";
    this.WORKER_NM = "";
    this.WORKER_ID = "";
    this.OUTSOURCING_AMT = "";
    this.REMARK = "";
    this.S_WORK_DAY = "";
    this.S_WORK_DAY_INPUT = "";
    this.S_WORK_DAY_VIEW = "";
    this.S_WORK_TIME = "";
    this.E_WORK_DAY = "";
    this.E_WORK_DAY_INPUT = "";
    this.E_WORK_DAY_VIEW = "";
    this.E_WORK_TIME = "";
    this.WORK_TOT_MIN = "0";
    this.WORK_TOT_HOUR = "0";
    this.SET_MIN = "0";
    this.SET_MANNED_MIN = "0";
    this.SET_MANLESS_MIN = "0";
    this.SET_RAW_MIN = "0";

    this.SET_HOUR = "0";
    this.SET_MANNED_HOUR = "0";
    this.SET_MANLESS_HOUR = "0";
    this.SET_RAW_HOUR = "0";

    this.SET_TOT_MIN = "0";
    this.SET_TOT_HOUR = "0";
    this.CONFIRM_YN = "";
    this.WORK_PROCEDURE = ""
    this.receive_dt.nativeElement.value = "";

    this.SET_MANNED_CD="";
    this.SET_RAW_CD="";
    //readonly
    this.READ_WORK_TOT_HOUR = "";

    this.CHK_OK = "";
    this.CHK_ERROR = "";


    //this.AuthorityManagement();
    this.Data_Load();
  }

  private AuthorityManagement() {
    //현재 주석처리( 특별하게 버튼에 대한 권한을 하드코딩할때를 대비)
    //(, 단위로 IN으로  해당  역할인지 cnt를 구해오는 로직임)

    if (this.user.empId == undefined) return;
    //해당 공정에 소속된 사람인지 확인
    //1 금형 관리 시스템 전체 관리
    //2 공정 계획 수립
    //3 공정 작업 수행
    //4 현황 조회
    //5 공정 담당 팀장
    let param = [{
      emp_no: this.user.empId
      ,arr_admin_tp: "1,2,5"
    }];
    this.pmsApiService.fetch('WPCommon/Role_Authority', param).subscribe(result => {

      if(result.data.length > 0)
      {
        let cnt = result.data[0]["CNT"];
      }

    })
  }

  private Data_Load() {
    this.input_disabled = true;           //기본Road된 화면 disabled
    this.confirm_disabled = false;        //확정버튼클릭시 disabled 여부
    this.confirm_button_disabled = false; //확정여부를 알기위하여 확정시 disabled
    this.modal_title;                      //팝업타이틀 이름정의
    this.readonly_color = "#eee";          //리드온리인것들 색상 정의
    this.amt_readonly = false;                     //외주여부에 따라서 외주금액 readonly;
    this.amt_readonly_color = "";                  //외주여부에 따라서 외주금액 색상변

    this.chk_ok_error_disabled = false;    //자주검사,불량확정 여부 활성화
    this.chk_ok_error_color = "#eee";
    this.none_start = true;                       //선행공정이 끝나지 않으면 시작일자 종료일자 디저블
    this.none_start_color = "#eee";               //선행공정이 끝나지 않으면 시작일자 종료일자 색상변경

    if (this.P_WORK_ID == undefined) return;

    let param = [{
      product_work_id: this.P_WORK_ID
      //product_work_id: "365"
    }];
    //this.PRODUCT_WORK_ID = "365"; //삭제
    this.pmsApiService.fetch('productwork/product_work_view', param).subscribe(result => {

      for (let obj of result.data) {
                for (let key in obj) {
                    //console.log("key : " + key + ",  value : ", obj[key]);
                    this[key] = obj[key];
                }
              }

              if(result.data[0].RECEIVE_DT != "" && result.data[0].RECEIVE_DT != undefined){
                this.receive_dt.nativeElement.value = result.data[0].RECEIVE_DT;
              }

              this.change_facilities_list(this.FACILITIES_CD);
              this.change_worker_list(this.WORKER_ID);

              this.getNumber(this.OUTSOURCING_AMT); //외주금액 콤마

              //로드된후에 불러라
              if(this.S_WORK_DAY_INPUT != "" && this.S_WORK_DAY_INPUT != undefined) this.getDiffTime('S',this.S_WORK_DAY_INPUT);
              if(this.E_WORK_DAY_INPUT != "" && this.E_WORK_DAY_INPUT != undefined) this.getDiffTime('E',this.E_WORK_DAY_INPUT);


              //확정유무 확인에 따른 확인
              //작업(WORK),외주(OUT),나의(MY)
              //나의작업공정인경우는 권한이 없기때문에 확정시 트루
              //관리자일경우도 이후 재개 로직에 영향으로 변경 불가
              if(this.P_WORK_TYPE == "MY") //나의공정
              {
                if(this.CONFIRM_YN == "Y"){
                  this.confirm_button_disabled = true; //확정시에만 무조건 disable(락 및 기타 로직 안태움)
                  this.confirm_disabled = true;
                  this.chk_ok_error_disabled = true;
                  this.chk_ok_error_color = "#eee";
                }
                else {
                  this.confirm_disabled = false;
                  this.chk_ok_error_disabled = false;
                  this.chk_ok_error_color = "";
                }
              }
              else{ //작업공정 외주공정
                if(this.CONFIRM_YN == "Y"){
                  this.confirm_button_disabled = true; //확정시에만 무조건 disable(락 및 기타 로직 안태움)
                  this.chk_ok_error_disabled = true;
                  this.chk_ok_error_color = "#eee";
                }
                else{
                  this.chk_ok_error_disabled = false;
                  this.chk_ok_error_color = "";
                }
              }

              //선행공정이 끝나지 않으면 시작일자 종료일자를 readonly disable 시작
              let param = [{
                product_id: this.PRODUCT_ID
              }];
              this.pmsApiService.fetch('productwork/work_start_check', param).subscribe(result => {
                if (result.code == "00") {
                  if (result.data.length > 0) {
                    if(result.data[0].IS_LOCK == "Y")
                    {
                        //불량 처리가 있다면 다음공정 시작을 못함
                        this.none_start = true;
                        this.none_start_color = "#eee";
                    }
                    else{
                      //락이 없다면 현재 진행해야할 공정번호가 같은지 확인 다르면 시작못함.
                      if(result.data[0].PRODUCT_WORK_ID != this.PRODUCT_WORK_ID)
                      {
                        this.none_start = true;
                        this.none_start_color = "#eee";
                      }
                      else{
                        this.none_start = false;
                        this.none_start_color = "";
                      }
                    }
                  }
                  else
                  {
                    this.none_start = true;
                    this.none_start_color = "#eee";
                  }
                } else {
                  alert("오류 등록");
                }
              });
              //선행공정이 끝나지 않으면 시작일자 종료일자를 readonly disable 끝
    })
  }

  @ViewChild('lgModal_add') public lgModal_add: ModalDirective;

  deleteTime(gubun){
    this[gubun+ "_WORK_DAY_INPUT"] = "";
    this[gubun+ "_WORK_DAY_VIEW"] = "";
    this[gubun+ "_WORK_DAY"] = "";
    this[gubun+ "_WORK_TIME"] = "";
    this.min_hour_sum();
  }

  getDiffTime(gubun,val){

    //시작시간이없다면 완료시간을 입력할수 없다.
    if(gubun == "E")
    {
      if(gubun == "E" && this.S_WORK_DAY_INPUT == "")
      {
        this.deleteTime("E");
        this.notificationService.smallBox({
          title: "작업시작시간이 없습니다..",
          content: "입력할 수 없습니다.",
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
      }
      else{
        this.inputgettime(gubun,val)
      }
    }

    //선행 완료 여부 체크
    if(gubun == "S")
    {
        this.inputgettime(gubun,val)
    }

  }

  inputgettime(gubun,val){

    //시작
    //if(this[gubun+ "_WORK_DAY_VIEW"] == "") return;
    if(val.toString().length == 12){
      //2018 07 23 15 34
      //console.log(val.substring( 0, 4 ))
      //console.log(val.substring( 4, 6 ))
      //console.log(val.substring( 6, 8 ))
      //console.log(val.substring( 8, 10 ))
      //console.log(val.substring( 10, 12 ))

      //입력된 년월일로 뷰로 표기하기 위함
      this[gubun+ "_WORK_DAY_VIEW"] = val.substring( 0, 4 ) +"년 ";
      this[gubun+ "_WORK_DAY_VIEW"] += val.substring( 4, 6 ) +"월 ";
      this[gubun+ "_WORK_DAY_VIEW"] += val.substring( 6, 8 ) +"일 ";
      this[gubun+ "_WORK_DAY_VIEW"] += val.substring( 8, 10 ) +"시 ";
      this[gubun+ "_WORK_DAY_VIEW"] += val.substring( 10, 12 ) +"분";

      //입력된 폼을 저장하기 위해 2018-01-01 형식 날짜저장
      this[gubun+ "_WORK_DAY"] = val.substring( 0, 4 )  +"-"+ val.substring( 4, 6 ) +"-"+ val.substring( 6, 8 );
      //입력된 폼을 저장하기 위해 13:15 형식 시간저장
      this[gubun+ "_WORK_TIME"] = val.substring( 8, 10 ) +":"+ val.substring( 10, 12 );
    }
    else{
      let d = new Date();
      this[gubun+ "_WORK_DAY_VIEW"] = d.getFullYear() +"년 ";
      this[gubun+ "_WORK_DAY_VIEW"] += this.stringright("00"+(d.getMonth() + 1),2) +"월 ";
      this[gubun+ "_WORK_DAY_VIEW"] += this.stringright("00"+d.getDate(),2) +"일 ";
      this[gubun+ "_WORK_DAY_VIEW"] += this.stringright("00"+d.getHours(),2) +"시 ";
      this[gubun+ "_WORK_DAY_VIEW"] += this.stringright("00"+d.getMinutes(),2) +"분";

      this[gubun+ "_WORK_DAY_INPUT"] = d.getFullYear()+"";
      this[gubun+ "_WORK_DAY_INPUT"] += this.stringright("00"+(d.getMonth() + 1),2);
      this[gubun+ "_WORK_DAY_INPUT"] += this.stringright("00"+d.getDate(),2);
      this[gubun+ "_WORK_DAY_INPUT"] += this.stringright("00"+d.getHours(),2);
      this[gubun+ "_WORK_DAY_INPUT"] += this.stringright("00"+d.getMinutes(),2);

      //입력된 폼을 저장하기 위해 2018-01-01 형식 날짜저장
      this[gubun+ "_WORK_DAY"] = d.getFullYear()  +"-"+ this.stringright("00"+(d.getMonth() + 1),2) +"-"+ this.stringright("00"+d.getDate(),2);
      //입력된 폼을 저장하기 위해 13:15 형식 시간저장
      this[gubun+ "_WORK_TIME"] = this.stringright("00"+d.getHours(),2) +":"+ this.stringright("00"+d.getMinutes(),2);
    }
    if(this.E_WORK_DAY_INPUT != "")
    {
      if(this.S_WORK_DAY_INPUT >= this.E_WORK_DAY_INPUT){
        this.E_WORK_DAY_INPUT = "";
        this.E_WORK_DAY_VIEW = "";
        this.E_WORK_DAY = "";
        this.E_WORK_TIME = "";

        this.notificationService.smallBox({
          title: "종료시간이 시작시간보다 같거나 작습니다",
          content: "작업시간을 확인하세요.",
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
      }
    }
    this.min_hour_sum();
    //끝
  }

  min_hour_sum(){

    if(this.S_WORK_DAY_INPUT != "" && this.E_WORK_DAY_INPUT != ""){
      let startTime = this.S_WORK_DAY_INPUT;    // 시작일시 ('20090101 12:30:00')
      let endTime  = this.E_WORK_DAY_INPUT;    // 종료일시 ('20091001 17:20:10')

      // 시작일시
      let startDate : any = new Date(parseInt(startTime.substring(0,4), 10),
                parseInt(startTime.substring(4,6), 10)-1,
                parseInt(startTime.substring(6,8), 10),
                parseInt(startTime.substring(8,10), 10),
                parseInt(startTime.substring(10,12), 10),
               );

      // 종료일시
      let endDate : any = new Date(parseInt(endTime.substring(0,4), 10),
                parseInt(endTime.substring(4,6), 10)-1,
                parseInt(endTime.substring(6,8), 10),
                parseInt(endTime.substring(8,10), 10),
                parseInt(endTime.substring(10,12), 10),
               );

      // 두 일자(startTime, endTime) 사이의 차이를 구한다.
      let dateGap = endDate.getTime() - startDate.getTime();
      let timeGap = new Date(0, 0, 0, 0, 0, 0, endDate - startDate);

      // 두 일자(startTime, endTime) 사이의 간격을 "일-시간-분"으로 표시한다.
      let diffDay  = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수
      let diffHour = timeGap.getHours();       // 시간
      let diffMin  = timeGap.getMinutes();      // 분

      //alert(diffDay + "일 " + diffHour + "시간 " + diffMin + "분 ");
      //총분 = 작업시작~작업종료
      let w_tot_min = (diffHour * 60);
      w_tot_min += (diffMin);
      w_tot_min += ((diffDay * 24) * 60);

      //작업시간 총시간
      let w_tot_hour = Number(w_tot_min/60).toFixed(1);
      //읽기전용 작업시간
      this.READ_WORK_TOT_HOUR = w_tot_hour + " 시간";

      //에서 셋팅,유인,무인,미가공 -
      w_tot_hour = (Number(w_tot_hour) - Number(this.SET_HOUR)).toFixed(1);
      w_tot_hour = (Number(w_tot_hour) - Number(this.SET_MANNED_HOUR)).toFixed(1);
      w_tot_hour = (Number(w_tot_hour) - Number(this.SET_MANLESS_HOUR)).toFixed(1);
      w_tot_hour = (Number(w_tot_hour) - Number(this.SET_RAW_HOUR)).toFixed(1);

      this.WORK_TOT_MIN = (Number(w_tot_hour) * 60).toString();
      this.WORK_TOT_HOUR = Number(w_tot_hour).toFixed(1);

      //가공시간 총분
      let s_tot_min = Number(this.SET_HOUR) * 60;
      s_tot_min += Number(this.SET_MANNED_HOUR) * 60;
      s_tot_min += Number(this.SET_MANLESS_HOUR) * 60;
      this.SET_TOT_MIN = s_tot_min.toString();
      //가공시간 총시간
      let s_tot_hour = Number(s_tot_min/60).toFixed(1);
      this.SET_TOT_HOUR = s_tot_hour.toString();

      //분 저장
      this.SET_MIN = (Number(this.SET_HOUR) * 60).toFixed(1);
      this.SET_MANNED_MIN = (Number(this.SET_MANNED_HOUR) * 60).toFixed(1);
      this.SET_MANLESS_MIN = (Number(this.SET_MANLESS_HOUR) * 60).toFixed(1);
      this.SET_RAW_MIN = (Number(this.SET_RAW_HOUR) * 60).toFixed(1);

      //시 0.0으로 변경
      this.SET_HOUR = Number(this.SET_HOUR).toFixed(1);
      this.SET_MANNED_HOUR = Number(this.SET_MANNED_HOUR).toFixed(1);
      this.SET_MANLESS_HOUR = Number(this.SET_MANLESS_HOUR).toFixed(1);
      this.SET_RAW_HOUR = Number(this.SET_RAW_HOUR).toFixed(1);
    }
  }

  //오른쪽 문자열 가지고 오기
  stringright(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
  }

  //[] <--문자 범위 [^] <--부정 [0-9] <-- 숫자
  //[0-9] => \d , [^0-9] => \D
  rgx1 = /\D/g;  // /[^0-9]/g 와 같은 표현
  rgx2 = /(\d+)(\d{3})/;

  getNumber(val){
     var num01;
     var num02;
     num01 = val;
     num02 = num01.replace(this.rgx1,"");
     num01 = this.setComma(num02);
     this.OUTSOURCING_AMT =  num01;
  }

  setComma(inNum){
     var outNum;
     outNum = inNum;
     while (this.rgx2.test(outNum)) {
          outNum = outNum.replace(this.rgx2, '$1' + ',' + '$2');
      }
     return outNum;
  }
  //저장시 벨리데이션 체크
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

  savedata_add(c_save_yn) {
    //확정인경우
    if(c_save_yn == "Y")
    {

      if (this.save_Check("WORKER_ID", "작업자") == false) return;

      if(this.OUTSOURCING_CD != 'BS00006_0001' && this.OUTSOURCING_CD != 'BS00006_0006') //사내가 아니면
      {
        if (this.receive_dt.nativeElement.value == "")
        {
          this.notificationService.smallBox({
            title: "입고마감일을(를) 입력하세요.",
            content: "필수입력입니다.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
          return;
        }
        if (this.save_Check("OUTSOURCING_AMT", "외주금액") == false) return;
      }

      if (this.save_Check("PROGRESS_VOLUME", "가공수량") == false) return;

      if(this.facilities_cd_list.length != 0)
      {
        //사내와 사내설계인 경우만 필수
        if(this.OUTSOURCING_CD == "BS00006_0001" || this.OUTSOURCING_CD == "BS00006_0006")
        {
          if (this.save_Check("FACILITIES_CD", "설비") == false) return;
        }
      }

      if (this.save_Check("LARGE_CATEGOR_CD", "대분류") == false) return;
      if (this.save_Check("PRODUCT_PROGRESS", "제품진행여부") == false) return;
      if (this.save_Check("S_WORK_DAY", "작업시작") == false) return;
      if (this.save_Check("S_WORK_TIME", "작업시작") == false) return;
      if (this.save_Check("E_WORK_DAY", "작업종료") == false) return;
      if (this.save_Check("E_WORK_TIME", "작업종료") == false) return;

      if(Number(this.WORK_TOT_MIN) > 0 || Number(this.WORK_TOT_MIN) < 0){
          this.notificationService.smallBox({
            title: "작업시간합계을(를) 확인하세요.",
            content: "확인하세요.",
            color: "#C46A69",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 2000
          });
          return;
      }

      if(this.SET_MANNED_HOUR != "0" && this.SET_MANNED_HOUR != "0.0") //유인
      {
        if(this.SET_MANNED_CD == "")
        {
          if (this.save_Check("SET_MANNED_CD", "유인") == false) return;
        }
      }

      if(this.SET_RAW_HOUR != "0" && this.SET_RAW_HOUR != "0.0") //미가공
      {
        if(this.SET_RAW_CD == "")
        {
          if (this.save_Check("SET_RAW_CD", "미가공") == false) return;
        }
      }

      if (this.CHK_OK == "N") {
        this.notificationService.smallBox({
          title: "자주 검사을(를) 확인하세요.",
          content: "확인하세요.",
          color: "#C46A69",
          iconSmall: "fa fa-check fa-2x fadeInRight animated",
          timeout: 2000
        });
        return;
       }
    }

    let param = [{
      product_work_id: this.PRODUCT_WORK_ID
      , large_categor_cd: this.LARGE_CATEGOR_CD
      , progress_volume: this.PROGRESS_VOLUME
      , volume: this.VOLUME
      , product_progress: this.PRODUCT_PROGRESS
      , facilities_cd: this.FACILITIES_CD
      , outsourcing_cd: this.OUTSOURCING_CD
      , worker_id: this.WORKER_ID
      , outsourcing_amt: this.OUTSOURCING_AMT.replace(/,/gi, "")
      , remark: this.REMARK
      , s_work_day: this.S_WORK_DAY
      , s_work_time: this.S_WORK_TIME
      , e_work_day: this.E_WORK_DAY
      , e_work_time: this.E_WORK_TIME
      , work_tot_min: this.WORK_TOT_MIN
      , work_tot_hour: this.WORK_TOT_HOUR
      , set_min: this.SET_MIN
      , set_manned_min: this.SET_MANNED_MIN
      , set_manless_min: this.SET_MANLESS_MIN
      , set_raw_min: this.SET_RAW_MIN

      , set_hour: this.SET_HOUR
      , set_manned_hour: this.SET_MANNED_HOUR
      , set_manless_hour: this.SET_MANLESS_HOUR
      , set_raw_hour: this.SET_RAW_HOUR

      , set_tot_min: this.SET_TOT_MIN
      , set_tot_hour: this.SET_TOT_HOUR
      , emp_no: this.user.empId
      , confirm_yn: c_save_yn
      , work_procedure : this.WORK_PROCEDURE

      , receive_dt: this.receive_dt.nativeElement.value

      , set_manned_cd: this.SET_MANNED_CD
      , set_raw_cd : this.SET_RAW_CD

      , chk_ok : this.CHK_OK
      , chk_error : this.CHK_ERROR
    }];

    this.pmsApiService.fetch('productwork/product_work_update', param, "patch").subscribe(result => {
      if (result.code == "00") {
        //확정인 경우만 메시지 발송
        if(c_save_yn == "Y"){
          this.MessageAlram(this.CHK_ERROR)
        }
        this.closerefresh();
      } else {
        alert("오류 등록");
      }
    })
  }

  MessageAlram(errorYN) {
    let param = [{
      alarm_kind: 'PRODUCT_WORK'
      , alarm_sub_kind: this.PRODUCT_WORK_ID
      // , alarm_title: this.LARGE_CATEGOR_CD
      // , alarm_content: this.PROGRESS_VOLUME
      // , link_url: this.VOLUME
      , emp_no: this.user.empId
      , chk_error : errorYN
    }];

    this.pmsApiService.fetch('alarm/insert_Topmenu_alarm', param, "patch").subscribe(result => {
      if (result.code == "00") {
        this.closerefresh();
      } else {
        alert("오류 등록");
      }
    })
  }

  deletedata() {
    let param = [{
      product_work_id: this.PRODUCT_WORK_ID
    }];

    if(this.CONFIRM_YN == "N"){

      this.notificationService.smartMessageBox({
        title: "삭제하시겠습니까?",
        content: "",
        buttons: '[취소][삭제]'
      }, (ButtonPressed) => {
        if (ButtonPressed === "삭제") {
          this.pmsApiService.fetch('productwork/product_work_delete', param, "put").subscribe(result => {
            if (result.code == "00") {
              this.closerefresh();
            } else {
              alert("오류 삭제");
            }
          })
        }
        if (ButtonPressed === "취소") {

        }

      });
    }
    else{
      this.notificationService.smallBox({
        title: "삭제할 수 없습니다.",
        content: "확정된 공정입니다.",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 2000
      });
      return;
    }
  }

  //유저리스트 모달 싱글
  @ViewChild('lgModal_pop_user') public lgModal_pop_user:ModalDirective;

  //유저리스트 팝업 싱글
  private Show_Pop_User_Modal(cd,nm):void {
     this.Pop_dept_cd = "1";                //초기 선택할 부서 선택 ID
     this.Arr_Cd_Nm = {cd : cd, nm : nm};   //RETURN ID, NM 정의
     this.Use_YN = "Y";                     //Y = 현재사용부서 N = 미사용부서  "" 공백은 모두다
     this.Expanded_YN ="Y";                 //트리 펼침 Y = 모두다
     this.lgModal_pop_user.show();
  }

  private Close_Pop_User_Modal(arruser):void {
     //console.log(arruser)
     this[arruser.cd] = arruser.emp_no;
     this[arruser.nm] = arruser.emp_nm;

     this.lgModal_pop_user.hide();
  }

}
