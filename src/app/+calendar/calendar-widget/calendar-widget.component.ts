import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
//import {EventsService} from "../shared/events.service";

declare var $: any;
import { PmsApiService } from "../../core/api/pms-api.service";
import { UserService } from "../../shared/user/user.service";

@Component({
  selector: 'calendar-widget',
  templateUrl: './calendar-widget.component.html',
})
export class CalendarWidgetComponent implements OnDestroy {

  private $calendarRef: any;
  private calendar: any;
  public items;
  user: any;

  constructor(
    private el: ElementRef,
    private pmsApiService: PmsApiService,
    private userService: UserService
  ) {
    this.user = userService.getLoginInfo();
    System.import('script-loader!smartadmin-plugins/bower_components/fullcalendar/dist/fullcalendar.min.js').then(() => {
      this.render()
    })
  }


  render() {

    this.$calendarRef = $(document.getElementById('calendar'));

    this.calendar = this.$calendarRef.fullCalendar({
      lang: 'en',
      editable: false,
      draggable: false,
      selectable: false,
      selectHelper: false,
      unselectAuto: false,
      disableResizing: false,
      droppable: false,

      header: {
        left: 'title', //,today
        center: 'prev, next, today',
        right: 'month, agendaWeek, agendaDay' //month, agendaDay,
      },

      events: (start, end, timezone, callback) => {
        // //console.log(this.eventsService.store.events);
        // //여기서 데이터를 가져와 보내준다.

        // let aaa = [{
        //   "id": "ccvb2",
        //   "title": "ㅁㅁㅁ-1",
        //   "start": "2018-09-11",
        //   "end": "2018-09-11",
        //   "allDay": false,
        //   "className": ["event", "bg-color-darken"]
        // }]
        // callback(aaa)
        let param = [{emp_no: this.user.empId}];
        this.pmsApiService.fetch('alarm/calendar_list', param).subscribe(result => {
            this.items = result.data;
            callback(this.items)
        })
      },

      eventRender: (event, element, icon) => {
        if (event.description != "") {
          element.find('.fc-event-title').append("<br/><span class='ultra-light'>" + event.description + "</span>");
        }
        if (event.icon != "") {
          element.find('.fc-event-title').append("<i class='air air-top-right fa " + event.icon + " '></i>");
        }
      }
    }
    );

    $('.fc-header-right, .fc-header-center', this.$calendarRef).hide();

    $('.fc-left', this.$calendarRef).addClass('fc-header-title')
  }

  ngOnDestroy() {
    this.calendar.fullCalendar('destroy')
  }

  public period = 'Showing'

  changeView(period) {
    this.calendar.fullCalendar('changeView', period);
    this.period = period
  }

  next() {
    $('.fc-next-button', this.el.nativeElement).click();
  }

  prev() {
    $('.fc-prev-button', this.el.nativeElement).click();
  }

  today() {
    $('.fc-today-button', this.el.nativeElement).click();
  }


}
