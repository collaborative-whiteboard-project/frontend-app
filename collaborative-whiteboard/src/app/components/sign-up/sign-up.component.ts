import { Component } from '@angular/core';
import { AuthSerivce } from 'src/app/services/auth/auth.service';

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

  constructor(private authService: AuthSerivce) {}

  onSignUp() {
    if (this.email.length === 0) {
      this.emailEmpty = true;
    }

    if (this.firstName.length === 0) {
      this.firstNameEmpty = true;
    }

    if (this.password.length === 0) {
      this.passwordEmpty = true;
    }

    if (this.passwordConfirmation.length === 0) {
      this.passwordConfirmationEmpty = true;
    }

    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationIncorrect = true;
      this.passwordEmpty = false;
      this.passwordConfirmationEmpty = false;
    }

    this.authService.signUp(
      this.email,
      this.firstName,
      this.lastName,
      this.password
    );
  }

  onPasswordConfirmationChange() {
    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationEmpty = false;
      this.passwordConfirmationIncorrect = true;
    } else {
      this.passwordConfirmationIncorrect = false;
    }
  }
}
