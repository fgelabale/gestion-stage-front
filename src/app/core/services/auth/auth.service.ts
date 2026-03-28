import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  login(payload: { courrielEcole: string; motDePasse: string }) {
    return this.http
      .post<{ access_token: string; user: any }>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access_token);
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
  }
}