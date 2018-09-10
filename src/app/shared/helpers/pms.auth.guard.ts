import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserService} from "../user/user.service";

@Injectable()
export class PmsAuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.userService.getLoginInfo())
    {
      return true;
    }
    else{
      this.router.navigate(['/auth/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}
