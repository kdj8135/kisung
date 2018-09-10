import {Component, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  public title = 'app works!';

  public constructor(private viewContainerRef: ViewContainerRef) {}

}

// 
// import { Component, AfterViewInit } from '@angular/core';
// import {
//     Router, NavigationStart, NavigationCancel, NavigationEnd
// } from '@angular/router';
// @Component({
//     selector: 'app-root',
//     template: `
// <div class="app-layout">
//
//     <div [hidden]="!loading" class="loader">
//       <img src="assets/img/loading.gif" style="margin-top:20%;margin-left:50%;">
//     </div>
//     <div [hidden]="loading" class="router-output">
//       <router-outlet></router-outlet>
//     </div>
// </div>
// `
// })
// export class AppComponent implements AfterViewInit {
//     loading;
//     constructor(
//         private router: Router
//     ) {
//         this.loading = true;
//     }
//     ngAfterViewInit() {
//         this.router.events
//             .subscribe((event) => {
//                 if(event instanceof NavigationStart) {
//                     this.loading = true;
//                 }
//                 else if (
//                     event instanceof NavigationEnd ||
//                     event instanceof NavigationCancel
//                     ) {
//                     this.loading = false;
//                 }
//             });
//     }
// }
