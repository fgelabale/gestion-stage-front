import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../token-storage/token-storage.service';

export interface LoginRequest {
  courrielEcole: string;
  motDePasse: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    courrielEcole: string;
    prenom: string;
    nom: string;
    telephone?: string | null;
    role: string;
    etudiant?: {
      id: number;
      groupeId?: number | null;
      groupe?: string | null;
    } | null;
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

  getCurrentUserRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasRole(...roles: string[]): boolean {
    const role = this.getCurrentUserRole();
    return !!role && roles.includes(role);
  }

  getDefaultRouteByRole(): string {
    const role = this.getCurrentUserRole();

    switch (role) {
      case 'ADMIN':
      case 'ADMIN_READER':
      case 'SUPERVISEUR':
        return '/admin/manquants';
      case 'ETUDIANT':
        return '/stagiaire';
      default:
        return '/login';
    }
  }
}