import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EntraAuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  meEntra() {
    return this.http.get(`${this.baseUrl}/auth/me-entra`);
  }
}