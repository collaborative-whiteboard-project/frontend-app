import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

export interface SignUpDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthSerivce {
  jwtToken: string = '';
  userEmail: string = '';
  apiUrl = 'http://localhost:8080/api/v1';
  user: UserDto | null = null;
  userDataEventEmitter = new Subject<UserDto>();
  signOutEventEmitter = new Subject<void>();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  signIn(email: string, password: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const signInData: SignInDto = {
      email,
      password,
    };

    return this.http.post<{ token: string }>(
      this.apiUrl + '/auth/signin',
      JSON.stringify(signInData),
      { headers }
    );
  }

  signUp(
    email: string,
    firstName: string,
    lastName: string | null,
    password: string
  ) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const signupData: SignUpDto = {
      email,
      password,
      firstName,
      lastName,
    };
    return this.http.post<{ token: string }>(
      this.apiUrl + '/auth/signup',
      JSON.stringify(signupData),
      { headers }
    );
  }

  saveToken(token: string) {
    this.localStorageService.setItem('cowh_jwt', token);
  }

  getToken() {
    return this.localStorageService.getItem('cowh_jwt');
  }

  getLogged() {
    const user = this.localStorageService.getItem('cowh_logged_user');

    if (!!user) {
      return JSON.parse(user) as UserDto;
    }

    return null;
  }

  signOutUser() {
    this.localStorageService.deleteItem('cowh_logged_user');
    this.localStorageService.deleteItem('cowh_jwt');
    this.signOutEventEmitter.next();
  }

  getUserData(email: string) {
    this.http
      .post<UserDto>(this.apiUrl + '/user', JSON.stringify({ email }), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + this.localStorageService.getItem('cowh_jwt')!,
        }),
      })
      .subscribe({
        next: (user: UserDto) => {
          this.user = user;
          this.localStorageService.setUser('cowh_logged_user', user);
          this.userDataEventEmitter.next(user);
        },
        error: (error) => {
          console.log(JSON.stringify(error));
        },
      });
  }

  changeUserData(user: UserDto) {}

  changeUserPassword(password: string) {
    const jwt = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.patch<{ token: string }>(
      this.apiUrl + '/auth/change/user/password',
      { password },
      { headers }
    );
  }

  requestPasswordChange(email: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      this.apiUrl + '/auth/reset/password/email',
      JSON.stringify({ email: email }),
      { headers }
    );
  }

  resetPassword(token: string, password: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.patch(
      this.apiUrl + '/auth/reset/password',
      {
        resetToken: token,
        password,
      },
      { headers }
    );
  }
}
