import { Injectable } from '@angular/core';
import { UserRole } from 'src/app/enums/user-role.enum';
import { User } from 'src/app/models/user/user';
import { AuthSerivce, UserDto } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  apiUrl = 'http://localhost:8080/api/v1';

  constructor(
    private authService: AuthSerivce,
    private httpClient: HttpClient
  ) {}

  deleteUser(id: number) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.httpClient.delete<void>(this.apiUrl + `/user/delete/${id}`, {
      headers,
    });
  }

  changeUserData(
    id: number,
    firstName: string,
    lastName: string,
    role: string
  ) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });
    return this.httpClient.patch<UserDto>(
      this.apiUrl + '/user/change',
      {
        id,
        firstName,
        lastName,
        role,
      },
      { headers }
    );
  }

  getUser(email: string) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });
    return this.httpClient.post<UserDto>(
      this.apiUrl + '/user',
      { email },
      { headers }
    );
  }

  getAllUsers() {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.httpClient.get<UserDto[]>(this.apiUrl + '/user/all', {
      headers,
    });
  }
}
