import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthSerivce } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  @Output() goBackToSignIn = new EventEmitter();
  email = '';
  sendPressed = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthSerivce
  ) {}

  onSend() {
    this.sendPressed = true;
    if (this.email !== '') {
      this.authService.requestPasswordChange(this.email).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reset password link has been send to your email address.',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email is invalid.',
          });
        },
      });
    }
  }

  onBack() {
    this.goBackToSignIn.emit();
  }
}
