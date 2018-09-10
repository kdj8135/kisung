import { Component } from '@angular/core';
import { OnInit, AfterViewChecked } from '@angular/core';

import { RecentProjectsService } from "./recent-projects.service";
import { PmsApiService } from "../../../../core/api/pms-api.service";
import { UserService } from "../../../../shared/user/user.service";

@Component({
  selector: 'sa-recent-projects',
  templateUrl: './recent-projects.component.html'
  //,providers: [RecentProjectsService]
})
export class RecentProjectsComponent implements OnInit, AfterViewChecked {
  projects: any = [];
  currentProject: any = [{projectid: "", title:""}];
  constructor(private projectsService: RecentProjectsService) {
  }

  ngAfterViewChecked() {
    //setTimeout(() => {
      this.projects = this.projectsService.getProjects();
      this.currentProject = this.projectsService.getProjects_info();
  //      });
  }

  ngOnInit() {
    this.projects = this.projectsService.getProjects();
    this.currentProject = this.projectsService.getProjects_info();
  }

  setProject(project) {
    this.projectsService.setproject([{"title" : project.title, "projectid": project.projectid}] );
    //this.currentProject = project;
  }


}
