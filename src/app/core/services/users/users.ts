import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get(`${this.apiUrl}/users/etudiants`);
  }

  updateUserGroupe(userId: number, groupeId: number | null) {
    return this.http.patch(`${this.apiUrl}/users/${userId}/groupe`, {
      groupeId,
    });
  }
}