import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';
import { TableRowSelectEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/project/member';
import { Project } from 'src/app/models/project/project';
import { User } from 'src/app/models/user/user';
import { UserDto } from 'src/app/services/auth/auth.service';
import {
  ProjectService,
  SimpleProjectDto,
} from 'src/app/services/projects/projects.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  @Input() adminPanelVisible = true;
  @Output() adminPanelVisibleChange = new EventEmitter<boolean>();
  selectedUser: UserDto | null = null;
  selectedProject: SimpleProjectDto | null = null;
  userRoleOptions: SelectItem[] = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'REGULAR_USER', value: 'REGULAR_USER' },
  ];
  memberRoleOptions: SelectItem[] = [
    { label: 'VIEWER', value: 'VIEWER' },
    { label: 'EDITOR', value: 'EDITOR' },
    { label: 'OWNER', value: 'OWNER' },
  ];
  selectedProjectMember: Member | null = null;
  memberDialogVisible = false;

  getAllUsersSubscription = new Subscription();
  getAllProjectsSubscription = new Subscription();
  changeUserDataSubscription = new Subscription();
  changeProjectDataSubscription = new Subscription();
  deleteUserSubscription = new Subscription();
  deleteProjectSubscription = new Subscription();

  users: UserDto[] = [];
  projects: SimpleProjectDto[] = [];
  admin = 'admin';
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.getAllUsersSubscription.unsubscribe();
    this.deleteUserSubscription.unsubscribe();
    this.changeUserDataSubscription.unsubscribe();
    this.changeProjectDataSubscription.unsubscribe();
  }

  showAdminPanel() {
    this.getAllUsersSubscription = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
    });
    this.getAllProjectsSubscription = this.projectService
      .getAllProjects()
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
      });
  }

  closeAdminPanel() {
    this.adminPanelVisible = false;
    this.memberDialogVisible = false;
    this.adminPanelVisibleChange.emit(this.adminPanelVisible);
  }

  onCancel() {
    this.selectedUser = null;
  }

  onDelete() {
    this.deleteConfirmation();
  }

  deleteConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete user?',
      header: 'Delete confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: this.acceptDeleteConfirmation.bind(this),
    });
  }

  acceptDeleteConfirmation() {
    this.deleteUserSubscription = this.userService
      .deleteUser(this.selectedUser?.id!)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted succesfully',
          });
          this.selectedUser = null;
          this.showAdminPanel();
        },
      });
  }

  onChange() {
    this.changeConfirmation();
  }

  print(s: any) {
    console.log(JSON.stringify(s));
  }

  onProjectSelect(event: TableRowSelectEvent) {
    this.selectedProject = this.projects.find((project) => {
      return project.id === (event.data as SimpleProjectDto).id;
    })!;
  }

  changeConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to change user data?',
      header: 'Change confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: this.acceptChangeConfirmation.bind(this),
    });
  }

  acceptChangeConfirmation() {
    this.changeUserDataSubscription = this.userService
      .changeUserData(
        this.selectedUser?.id!,
        this.selectedUser?.firstName!,
        this.selectedUser?.lastName!,
        this.selectedUser?.role!
      )
      .subscribe({
        next: (user) => {
          this.messageService.add({
            severity: 'success',
            summary: 'User data changed',
            detail: 'User data changed succesfully',
          });
          this.showAdminPanel();
        },
      });
  }

  onMemberSelection(event: TableRowSelectEvent) {
    const member = event.data as Member;
    if (!!member) {
      this.selectedProjectMember = {
        memberEmail: member.memberEmail,
        memberRole: member.memberRole,
      };
    }
    this.memberDialogVisible = true;
  }

  onProjectChange() {
    this.projectChangeConfirmation();
  }

  onUserSelect(event: TableRowSelectEvent) {
    this.selectedUser = { ...(event.data as UserDto) };
  }

  projectChangeConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change project data?',
      header: 'Change confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: this.acceptProjectChangeConfirmation.bind(this),
    });
  }

  onProjectDelete() {
    this.projectDeleteConfirmation();
  }

  projectDeleteConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete project?',
      header: 'Delete confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: this.acceptProjectDeleteConfirmation.bind(this),
    });
  }

  onProjectCancel() {
    this.selectedProject = null;
  }

  acceptProjectChangeConfirmation() {
    this.changeProjectDataSubscription = this.projectService
      .changeProjectData(this.selectedProject!)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Project data changed successfully.',
        });
        this.showAdminPanel();
      });
  }

  acceptProjectDeleteConfirmation() {
    this.deleteProjectSubscription = this.projectService
      .deleteProject(this.selectedProject?.id!)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Project deleted',
            detail: 'Project deleted succesfully',
          });
          this.projects = this.projects.filter(
            (project) => project.id !== this.selectedProject?.id
          );
          this.selectedProject = null;
        },
      });
  }

  onMemberRoleChange(event: SelectButtonChangeEvent) {
    this.selectedProjectMember!.memberRole! = (
      event.value as string
    ).toUpperCase();
  }

  onMemberRoleChangeConfirm() {
    this.selectedProject?.members.forEach((member) => {
      if (member.memberEmail === this.selectedProjectMember?.memberEmail) {
        member.memberRole = this.selectedProjectMember.memberRole;
      }
    });
    this.memberDialogVisible = false;
  }
}
