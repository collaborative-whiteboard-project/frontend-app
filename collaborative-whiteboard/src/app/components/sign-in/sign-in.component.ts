import { Component } from '@angular/core';
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

  constructor(private authService: AuthSerivce) {}

  onSignIn() {
    if (this.email.length === 0) {
      this.emailEmpty = true;
    }

    if (this.password.length === 0) {
      this.passwordEmpty = true;
    }

    if (!this.emailEmpty && !this.passwordEmpty) {
      this.authService.signIn(this.email, this.password);
    }
  }
}
