import {Component, OnInit, Input, AfterContentInit, ElementRef} from '@angular/core';
import { PmsApiService } from "../../core/api/pms-api.service";
import { UserService } from "../../shared/user/user.service";
@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
  public items;
  user: any;

  @Input() public state: any;

  constructor(
    private pmsApiService: PmsApiService
   ,private userService: UserService
  ) {
  this.user = userService.getLoginInfo();
}

  ngOnInit() {
    let param = [{emp_no: this.user.empId}];
    this.pmsApiService.fetch('alarm/todo_list', param).subscribe(result => {
        this.items = result.data;
    })
  }
}
