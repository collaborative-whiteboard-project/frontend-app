import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project/project';
import { AuthSerivce } from 'src/app/services/auth/auth.service';
import {
  ProjectService,
  SimpleProjectDto,
} from 'src/app/services/projects/projects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayProjectsItems: MenuItem[] = [
    {
      label: 'Projects',
      items: [
        {
          label: 'All projects',
          command: this.onAllProjects.bind(this),
        } as MenuItem,
        {
          label: 'My projects',
          command: this.onMyProjects.bind(this),
        } as MenuItem,
      ],
    },
  ];

  createProjectItems: MenuItem[] = [
    {
      label: 'Create',
      items: [
        {
          label: 'New project',
          icon: 'pi pi-plus',
          command: () => {
            this.createProjectPanelVisible = true;
          },
        },
      ],
    },
  ];

  username: string = '';
  createProjectPanelVisible = false;
  newProjectName = '';
  projects: SimpleProjectDto[] = [];
  projectsToDisplay: SimpleProjectDto[] = [];
  allProjectsSelected = true;

  userDataSubscribtion = new Subscription();
  userProjectsSubscribtion = new Subscription();
  userPrjectsAfterCreateSubscribtion = new Subscription();
  createProjectSubscribtion = new Subscription();
  updateProjectsAfterDataChangeSubscribtion = new Subscription();

  constructor(
    private projectService: ProjectService,
    private authService: AuthSerivce,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLogged();
    if (!!user) {
      this.username = `${user.firstName} ${user.lastName}`;
    }
    this.userDataSubscribtion = this.authService.userDataEventEmitter.subscribe(
      (user) => {
        this.username = `${user.firstName} ${user.lastName}`;
      }
    );

    this.userProjectsSubscribtion = this.projectService
      .getUserProjects()
      .subscribe((projects) => {
        this.projects = projects;
        this.projectsToDisplay = projects;
      });
  }

  ngOnDestroy(): void {
    this.userDataSubscribtion.unsubscribe();
    this.userProjectsSubscribtion.unsubscribe();
    this.userPrjectsAfterCreateSubscribtion.unsubscribe();
    this.createProjectSubscribtion.unsubscribe();
    this.updateProjectsAfterDataChangeSubscribtion.unsubscribe();
  }

  onAllProjects() {
    this.projectsToDisplay = this.projects;
    this.allProjectsSelected = true;
  }

  onMyProjects() {
    const user = this.authService.getLogged();
    this.projectsToDisplay = this.projects.filter((project) => {
      const result = project.members.find(
        (member) =>
          member.memberEmail === user?.email && member.memberRole === 'OWNER'
      );

      if (!!result) {
        return true;
      }
      return false;
    });
    this.allProjectsSelected = false;
  }

  onCreateProject() {
    if (this.newProjectName.length !== 0) {
      this.createProjectSubscribtion = this.projectService
        .createProject(this.newProjectName)
        .subscribe({
          next: () => {
            this.createProjectPanelVisible = false;
            this.displayProjectCreationSuccess();
            this.userPrjectsAfterCreateSubscribtion = this.projectService
              .getUserProjects()
              .subscribe((projects) => {
                this.projects = projects;
                if (this.allProjectsSelected) {
                  this.onAllProjects();
                  return;
                }

                this.onMyProjects();
              });
          },
          error: () => {
            this.displayPasswordChangeErrorMessage(
              'Error occured during creating password.'
            );
          },
        });
      return;
    }
    this.displayPasswordChangeErrorMessage('Project name cannot be empty.');
  }

  onChangesApplied() {
    this.updateProjectsAfterDataChangeSubscribtion = this.projectService
      .getUserProjects()
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          if (this.allProjectsSelected) {
            this.onAllProjects();
            return;
          }

          this.onMyProjects();
        },
      });
    return;
  }

  closeCreateProjectPanel() {
    this.newProjectName = '';
  }

  displayProjectCreationSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'New project created',
      detail: 'New project created succesfully',
    });
  }

  displayPasswordChangeErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
