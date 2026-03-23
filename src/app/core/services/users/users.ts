import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStudents() {
    return this.http.get(`${this.apiUrl}/users/etudiants`);
  }

  updateUserGroupe(userId: number, groupeId: number | null) {
    return this.http.patch(`${this.apiUrl}/users/${userId}/groupe`, {
      groupeId,
    });
  }

  getSuperviseurs() {
    return this.http.get(`${this.apiUrl}/users/superviseurs`);
  }

  assignSuperviseurToGroupe(groupeId: number, superviseurId: number) {
    return this.http.post(`${this.apiUrl}/users/assigner-superviseur-groupe`, {
      groupeId,
      superviseurId,
    });
  }

  assignSuperviseurToEtudiants(userId: number[], superviseurId: number) {
    return this.http.post(`${this.apiUrl}/users/assigner-superviseur-etudiants`, {
      userId,
      superviseurId,
    });
  }

  createUser(payload: any) {
    return this.http.post(`${this.apiUrl}/users/create`, payload);
  }
}