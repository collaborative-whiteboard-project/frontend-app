import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthSerivce } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  passwordConfirmation = '';
  clicked = false;
  token = '';

  constructor(
    private authService: AuthSerivce,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.token = String(this.activatedRoute.snapshot.params['token']);
  }

  onReset() {
    this.clicked = true;
    if (
      this.password === this.passwordConfirmation &&
      this.password.length !== 0 &&
      this.token !== ''
    ) {
      this.authService.resetPassword(this.token, this.password).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed.',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occured during changing password.',
          });
        },
        complete: () => {
          this.router.navigate(['']);
        },
      });
    }
  }
}
