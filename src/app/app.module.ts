import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';

/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing'
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Core providers
import {CoreModule} from "./core/core.module";
import {SmartadminLayoutModule} from "./shared/layout/layout.module";

import { ModalModule } from 'ngx-bootstrap/modal';

//PMS add
import { PmsInterceptor } from './shared/helpers/index';
import { PmsAuthGuard } from './shared/helpers/index';
import { GlobalsVariable } from './shared/helpers/index';
import { WindowRef } from './shared/helpers/index';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// COMPOSITION_BUFFER_MODE import(한글입력시 버퍼를 삭제)
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,

  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    ModalModule.forRoot(),


    CoreModule,

    SmartadminLayoutModule,

    routing
  ],
  exports: [
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    // ENV_PROVIDERS,
    APP_PROVIDERS,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: PmsInterceptor,
        multi: true
    },
    PmsAuthGuard,
    GlobalsVariable,
    WindowRef,
    {
        provide: COMPOSITION_BUFFER_MODE,
        useValue: false
      }
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}


}
