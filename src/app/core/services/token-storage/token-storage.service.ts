import { Injectable } from '@angular/core';

const TOKEN_KEY = 'gestion_stage_token';
const USER_KEY = 'gestion_stage_user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  saveUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}