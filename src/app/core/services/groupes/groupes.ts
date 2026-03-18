import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGroupes() {
    return this.http.get(`${this.apiUrl}/groupes`);
  }

  createGroupe(payload: any) {
    return this.http.post(`${this.apiUrl}/groupes`, payload);
  }
}