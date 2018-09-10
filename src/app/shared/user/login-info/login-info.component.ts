import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user:any;

  constructor(
    private userService: UserService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    this.user = this.userService.getLoginInfo()    

    //this.user = JSON.parse(localStorage.getItem('currentUser'))

    //임시
    this.user.picture = "assets/img/avatars/sunny.png";

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
