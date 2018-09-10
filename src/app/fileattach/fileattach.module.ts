//import { enableProdMode, NgModule } from '@angular/core';
import { NgModule } from '@angular/core';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './fileattach.routing';
import { FileAttachComponent } from './fileattach.component';

@NgModule({
  imports:      [
    UploadModule, routing,FormsModule, CommonModule

    // BrowserModule, HttpClientModule
    // , UploadModule, BrowserAnimationsModule, FormsModule
    // , ReactiveFormsModule,routing
  ],
  declarations: [ FileAttachComponent ],
  exports: [
        FileAttachComponent
    ],
    providers: [
    ]
  // ,bootstrap:    [ FileAttachComponent ]
})


export class FileAttachModule {}
// //
  //enableProdMode();
//
  // const platform = platformBrowserDynamic();
  // platform.bootstrapModule(FileAttachModule);
