import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableRowSelectEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/project/member';
import { Project } from 'src/app/models/project/project';
import {
  ProjectService,
  SimpleProjectDto,
} from 'src/app/services/projects/projects.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-manage-project-panel',
  templateUrl: './manage-project-panel.component.html',
  styleUrls: ['./manage-project-panel.component.scss'],
})
export class ManageProjectPanelComponent implements OnInit, OnDestroy {
  @Input() project: SimpleProjectDto | null = null;
  @Input() manageProjectDialogVisible = false;
  @Output() manageProjectDialogVisibleChange = new EventEmitter<boolean>();
  @Output() changesApplied = new EventEmitter();
  memberDialogVisible = false;
  addMemberDialogVisible = false;
  newMemberEmail = '';
  newMemberRole = '';
  memberRoleOptions = ['viewer', 'editor', 'owner'];
  selectedProjectMember: Member | null = null;

  getUserSubscribtion = new Subscription();
  changeProjectDatSubscribtion = new Subscription();
  deleteProjectSubscribtion = new Subscription();

  projectCopy: SimpleProjectDto = {
    id: 0,
    name: '',
    modifiedAt: new Date(),
    members: [],
  };

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.projectCopy = {
      ...this.project!,
      members: [...this.project!.members],
    };
  }

  ngOnDestroy(): void {
    this.getUserSubscribtion.unsubscribe();
    this.changeProjectDatSubscribtion.unsubscribe();
  }

  showDialog() {
    this.projectCopy = {
      ...this.project!,
      members: [...this.project!.members],
    };
  }

  closeDialog() {
    this.manageProjectDialogVisible = false;
    this.manageProjectDialogVisibleChange.emit(this.manageProjectDialogVisible);
    this.projectCopy = {
      ...this.project!,
      members: [...this.project!.members],
    };
  }

  onMemberSelection(event: TableRowSelectEvent) {
    if (!!event.data) {
      this.selectedProjectMember = Object.assign({}, event.data as Member);
      this.memberDialogVisible = true;
    }
  }

  saveProjectChanges() {
    this.changeProjectDatSubscribtion = this.projectService
      .changeProjectData(this.projectCopy)
      .subscribe({
        next: () => {
          this.closeDialog();
          this.changesApplied.emit();
          this.showSuccessMessage('Changes saved.');
        },
      });
  }

  onProjectDelete() {
    this.deleteProjectSubscribtion = this.projectService
      .deleteProject(this.projectCopy.id)
      .subscribe({
        next: () => {
          this.closeDialog();
          this.changesApplied.emit();
          this.showSuccessMessage('Project deleted.');
        },
      });
  }

  onCancel() {
    this.closeDialog();
  }

  onMemberChangesSave() {
    this.projectCopy.members
      .filter((member) => {
        return member.memberEmail === this.selectedProjectMember?.memberEmail;
      })
      .forEach((member) => {
        member.memberRole =
          this.selectedProjectMember?.memberRole!.toUpperCase()!;
        this.memberDialogVisible = false;
      });
  }

  onMemberDelete() {
    this.projectCopy.members = this.projectCopy.members.filter((member) => {
      return member.memberEmail !== this.selectedProjectMember?.memberEmail;
    });
    this.memberDialogVisible = false;
  }

  onMemberCancel() {
    this.memberDialogVisible = false;
  }

  onAddMember() {
    this.addMemberDialogVisible = true;
  }

  onAddNewMemberButton() {
    let newUserDataCorrect = true;
    if (this.newMemberEmail.length === 0) {
      this.showErrorMessage('New user email cannot be empty.');
      newUserDataCorrect = false;
    }

    if (this.newMemberRole === '') {
      this.showErrorMessage('Select user role to add member to project.');
      newUserDataCorrect = false;
    }
    console.log(this.newMemberRole);

    if (!newUserDataCorrect) {
      return;
    }

    this.getUserSubscribtion = this.userService
      .getUser(this.newMemberEmail)
      .subscribe({
        next: (user) => {
          this.projectCopy.members.push({
            memberEmail: user.email,
            memberRole: this.newMemberRole.toUpperCase(),
          });
          this.addMemberDialogVisible = false;
        },
        error: (error) => {
          switch (error.status) {
            case 400: {
              this.showErrorMessage('Entered email is incorrect.');
              break;
            }
            case 404: {
              this.showErrorMessage('User with given email not found.');
              break;
            }
          }
        },
      });
    return;
  }

  onAddMemberCancelButton() {
    this.newMemberEmail = '';
    this.addMemberDialogVisible = false;
  }

  showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
}
