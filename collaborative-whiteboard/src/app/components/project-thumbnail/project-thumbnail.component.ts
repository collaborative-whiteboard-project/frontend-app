import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Project } from 'src/app/models/project/project';
import { AuthSerivce } from 'src/app/services/auth/auth.service';
import { SimpleProjectDto } from 'src/app/services/projects/projects.service';

@Component({
  selector: 'app-project-thumbnail',
  templateUrl: './project-thumbnail.component.html',
  styleUrls: ['./project-thumbnail.component.scss'],
})
export class ProjectThumbnailComponent implements OnInit {
  manageProjectDialogVisible = false;
  membersListVisible = false;
  @Input() project: SimpleProjectDto | null = null;
  @Output() changesApplied = new EventEmitter();

  dropDownItems: MenuItem[] = [
    {
      label: 'Members',
      icon: 'pi pi-users',
      command: () => (this.membersListVisible = true),
    },
    {
      label: 'Manage project',
      icon: 'pi pi-cog',
      command: () => (this.manageProjectDialogVisible = true),
    },
  ];

  constructor(private router: Router, private authService: AuthSerivce) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getLogged();
    if (!!this.project) {
      if (
        this.project.members.filter(
          (member) =>
            member.memberEmail === loggedUser?.email &&
            member.memberRole === 'OWNER'
        ).length === 0
      ) {
        this.dropDownItems.at(1)!.visible = false;
      }
    }
  }

  onProjectEdit() {
    console.log(JSON.stringify(this.project));
    this.router.navigate([
      '/',
      'whiteboard',
      this.project?.id,
      this.project?.name.replaceAll(' ', '_'),
    ]);
  }

  onChangesApplied() {
    this.changesApplied.emit();
  }
}
