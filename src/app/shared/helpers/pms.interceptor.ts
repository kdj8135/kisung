import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import {Router} from '@angular/router';
import 'rxjs/add/operator/do';

@Injectable()
export class PmsInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });

            return next.handle(request);
        }
        else{
          //this.router.navigate(['auth/login']);
          //this.router.navigateByUrl('auth/login');
        }

        return next.handle(request);
    }

}
