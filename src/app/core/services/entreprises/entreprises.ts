import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EntreprisesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  findAll() {
        return this.http.get(`${this.apiUrl}/admin/entreprises`);
  }

  findOne(id: number) {
    return this.http.get<any>(`${this.apiUrl}/admin/entreprises/${id}`);
  }

  update(id: number, body: any) {
    return this.http.patch(`${this.apiUrl}/admin/entreprises/${id}`, body);
  }
}