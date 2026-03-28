import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilisateurCourant } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  me(): Observable<UtilisateurCourant> {
    const token = localStorage.getItem('token');
    //console.log('TOKEN SENT TO /me =', token);

    return this.http.get<UtilisateurCourant>(`${this.baseUrl}/auth/me`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}