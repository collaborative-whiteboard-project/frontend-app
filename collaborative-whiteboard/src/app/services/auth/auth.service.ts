import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSerivce {
  signIn(email: string, password: string) {}
  signUp(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {}
}
