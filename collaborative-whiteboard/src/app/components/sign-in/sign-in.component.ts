import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthSerivce } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  emailEmpty = false;
  passwordEmpty = false;
  @Output() forgotPassword = new EventEmitter();

  constructor(
    private authService: AuthSerivce,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSignIn() {
    if (this.email.length === 0) {
      this.emailEmpty = true;
    }

    if (this.password.length === 0) {
      this.passwordEmpty = true;
    }

    if (!this.emailEmpty && !this.passwordEmpty) {
      this.authService.signIn(this.email, this.password).subscribe({
        next: (token) => {
          this.authService.userEmail = this.email;
          this.authService.saveToken(token.token);
          this.authService.getUserData(this.email);
          this.router.navigate(['/', 'dashboard']);
          this.displaySuccessMessage('Signed in successfully.');
        },
        error: (error) => {
          console.log(error.error);
          this.displayErrorMessage('Incorrect login credentials.');
        },
      });
    }
  }

  onForgotPassword() {
    this.forgotPassword.emit();
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
