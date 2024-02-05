import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthSerivce, UserDto } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  @Input() userPanelVisible = false;
  @Output() userPanelVisibleChange = new EventEmitter<boolean>();
  userDataChanged = false;
  passwordsEmpty = true;
  passwordsIdentical = true;
  user: UserDto = { id: 0, email: '', firstName: '', lastName: '', role: '' };
  userCopy: UserDto = this.user;
  password: string = '';
  passwordConfirmation = '';

  constructor(
    private authService: AuthSerivce,
    private userService: UserService,
    private messageService: MessageService
  ) {
    authService.userDataEventEmitter.subscribe((user) => {
      this.user = user;
    });
  }

  closeUserPanel() {
    this.userPanelVisible = false;
    this.userPanelVisibleChange.emit(this.userPanelVisible);
    this.password = '';
    this.passwordConfirmation = '';
  }

  onShow() {
    this.user = this.authService.getLogged()!;
    this.userCopy = Object.assign({}, this.user);
  }

  onNameChange() {
    if (this.user.firstName !== this.userCopy.firstName) {
      this.userDataChanged = true;
      return;
    }

    if (this.user.lastName !== this.userCopy.lastName) {
      this.userDataChanged = true;
      return;
    }

    this.userDataChanged = false;
  }

  onNameChangeButton() {
    this.userService
      .changeUserData(
        this.userCopy.id,
        this.userCopy.firstName,
        this.userCopy.lastName,
        this.userCopy.role
      )
      .subscribe({
        next: (user) => {
          this.authService.getUserData(user.email);
          this.user = user;
          this.userCopy = Object.assign({}, this.user);
          this.userDataChanged = false;
          this.displayUserDataChangeSuccess();
        },
        error: () => {},
      });
  }

  displayUserDataChangeSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'User data changed',
      detail: 'User data changed succesfully',
    });
  }

  displayUserDataChangeError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error occured during changing user data.',
    });
  }

  onPasswordChange() {
    if (this.password.length !== 0 && this.passwordConfirmation.length !== 0) {
      this.passwordsEmpty = false;
      return;
    }

    this.passwordsEmpty = true;
  }

  onPasswordChangeButton() {
    if (this.password === this.passwordConfirmation) {
      this.authService.changeUserPassword(this.password).subscribe({
        next: (token) => {
          this.authService.saveToken(token.token);
          this.displayPasswordChangeSuccess();
        },
        error: () => {
          this.displayPasswordChangeSuccess();
        },
      });
      return;
    }
    this.passwordsIdentical = false;
  }

  displayPasswordChangeSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Password changed',
      detail: 'Password changed succesfully',
    });
  }

  displayPasswordChangeError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error occured during changing password.',
    });
  }
}
