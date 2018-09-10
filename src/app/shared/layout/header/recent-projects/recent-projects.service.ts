import { Injectable } from '@angular/core';
@Injectable()
export class RecentProjectsService {
  projects: any;
  sel_project: any;

  constructor() {
    let currentProject = JSON.parse(localStorage.getItem('currentProject'));
    this.projects = currentProject;

    if (this.projects.length > 0) {
      this.sel_project = this.projects[0];
    }
  }

  getProjects() {
    return this.projects;
  }

  getProjects_info() {
    return this.sel_project;
  }

  setproject(project) {
    this.sel_project = project[0];
  }

  addProjects(project) {
    let use_yn = "N";
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].projectid == project[0].projectid) {
        use_yn = "Y";
      }
    }

    if (use_yn == "N") {
      this.projects.push(project[0]);
    }
    this.sel_project = project[0];
  }
}
