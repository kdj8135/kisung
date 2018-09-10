"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAppModule(tree, path) {
    tree.create(path || '/src/app/app.module.ts', `
        import { NgModule } from '@angular/core';
        import { AppComponent } from './app.component';

        @NgModule({
            declarations: [
                AppComponent
            ],
            imports: []
        })
        export class AppModule { }
    `);
    return tree;
}
exports.createAppModule = createAppModule;
