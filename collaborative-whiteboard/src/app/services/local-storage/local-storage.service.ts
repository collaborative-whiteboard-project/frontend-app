import { Injectable } from '@angular/core';
import { UserDto } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  setUser(key: string, value: UserDto) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  deleteItem(key: string) {
    sessionStorage.removeItem(key);
  }
}
