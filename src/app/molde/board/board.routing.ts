import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardListComponent} from "./board_list/board_list.component";

export const boardRoutes: Routes = [

  {path: 'board_list', component: BoardListComponent, data: {pageTitle: '게시판'}}
];

export const BoardRouting = RouterModule.forChild(boardRoutes);
