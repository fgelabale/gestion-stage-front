import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../token-storage/token-storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    prenom?: string;
    nom?: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.tokenStorage.saveToken(response.access_token);
          this.tokenStorage.saveUser(response.user);
        }),
      );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.isLoggedIn();
  }

  getCurrentUser() {
    return this.tokenStorage.getUser();
  }
}