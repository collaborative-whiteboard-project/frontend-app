import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  cardHeader = '';

  forgotPasswordEnabled = false;

  onForgotPassword() {
    this.forgotPasswordEnabled = true;
    this.cardHeader = 'Reset password';
  }

  onGoBackToSignIn() {
    this.forgotPasswordEnabled = false;
    this.cardHeader = '';
  }
}
