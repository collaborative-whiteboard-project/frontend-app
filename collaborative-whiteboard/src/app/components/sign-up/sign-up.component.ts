import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthSerivce, UserDto } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  email = '';
  password = '';
  passwordConfirmation = '';
  firstName = '';
  lastName = '';
  emailEmpty = false;
  passwordEmpty = false;
  passwordConfirmationEmpty = false;
  passwordConfirmationIncorrect = false;
  firstNameEmpty = false;

  constructor(
    private authService: AuthSerivce,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSignUp() {
    let signUpDataOk = true;
    if (this.email.length === 0) {
      this.emailEmpty = true;
      signUpDataOk = false;
    }

    if (this.firstName.length === 0) {
      this.firstNameEmpty = true;
      signUpDataOk = false;
    }

    if (this.password.length === 0) {
      this.passwordEmpty = true;
      signUpDataOk = false;
    }

    if (this.passwordConfirmation.length === 0) {
      this.passwordConfirmationEmpty = true;
      signUpDataOk = false;
    }

    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationIncorrect = true;
      this.passwordEmpty = false;
      this.passwordConfirmationEmpty = false;
      signUpDataOk = false;
    }

    if (signUpDataOk) {
      this.authService
        .signUp(this.email, this.firstName, this.lastName, this.password)
        .subscribe({
          next: (token) => {
            console.log(token);
            this.authService.userEmail = this.email;
            this.authService.saveToken(token.token);
            this.authService.getUserData(this.email);
            this.router.navigate(['/', 'dashboard']);
            this.displaySuccessMessage('Signed up successfully.');
          },
          error: (error) => {
            console.log(`Error: ${error.error}`);
            this.displayErrorMessage('');
          },
        });
    }
  }

  onPasswordConfirmationChange() {
    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationEmpty = false;
      this.passwordConfirmationIncorrect = true;
    } else {
      this.passwordConfirmationIncorrect = false;
    }
  }

  displaySuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  displayErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
