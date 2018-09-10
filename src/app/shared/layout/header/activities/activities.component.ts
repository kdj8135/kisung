import {Component, OnInit, ElementRef, Renderer, OnDestroy} from '@angular/core';
import {ActivitiesService} from "./activities.service";

import { PmsApiService } from "../../../../core/api/pms-api.service";
import { UserService} from "../../../../shared/user/user.service";

import { Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html',
  providers: [ActivitiesService],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  count:number;
  lastUpdate:any;
  active:boolean;
  activities:any;
  currentActivity: any;
  loading: boolean;

  user:any;

  constructor(
    private el:ElementRef,
    private renderer: Renderer,
    private activitiesService:ActivitiesService,
    private pmsApiService: PmsApiService,
    private userService: UserService,
    private router: Router
    ) {
    this.active = false;
    this.loading = false;
    this.activities = [];
    this.count = 0;
    this.lastUpdate = new Date();
  }

  ngOnInit() {
     // this.activitiesService.getActivities().subscribe(data=> {
     //   this.activities = data;
     //   this.count = data.reduce((sum, it)=> sum + it.data.length, 0);
     //   this.currentActivity = data[1];
     // });

   //알림추가
    this.user = this.userService.getLoginInfo()
    this.empAlarmInfo();

    //1분에 한번씩 체크(리소스를 위해)
    setInterval(()=>{
      this.empAlarmInfo();
    }, 1000 * 60)
  }

  setActivity(activity){
    this.currentActivity = activity;
  }

  private documentSub: any;
  onToggle() {
    let dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn()


      this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub()
        }
      });


    } else {
      dropdown.fadeOut()

      this.documentUnsub()
    }
  }



  update(){
    // this.loading= true;
    // setTimeout(()=>{
    //   this.lastUpdate = new Date()
    //   this.loading = false
    // }, 1000)

    this.empAlarmInfo();
  }


  ngOnDestroy(){
    this.documentUnsub()
  }

  documentUnsub(){
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

  empAlarmInfo() {
    if(!this.user) this.user = this.userService.getLoginInfo();

    let param = [{emp_no: this.user.empNo}];
    this.pmsApiService.fetch('alarm/menu_info', param, "post").subscribe(result => {
      if (result.code == "00") {
        this.count = result.cnt;
        let data = {title : "Notify", name: "notification", data : result.data}
        this.currentActivity = data;
        this.lastUpdate = new Date();
      } else {
        alert("수정오류");
      }
    })

  }

  AlarmRead(item){
    //console.log(item.ALARM_NO);
    //console.log(item.LINK_URL);
    if(!this.user) this.user = this.userService.getLoginInfo();

    let param = [{
      emp_no: this.user.empNo
      ,alarm_no: item.ALARM_NO
    }];
    this.pmsApiService.fetch('alarm/update_view_Topmenu_alarm_target', param, "patch").subscribe(result => {
      if (result.code == "00") {
          this.empAlarmInfo();
          if(this.router.url == item.LINK_URL)
          {
            location.reload();
          }
          else{
            this.router.navigate([item.LINK_URL]);
            this.empAlarmInfo();
          }
      } else {
        alert("수정오류");
      }
    })

  }

}
