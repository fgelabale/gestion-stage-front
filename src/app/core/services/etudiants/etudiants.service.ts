import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EtudiantsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get(`${this.apiUrl}/etudiants/me`);
  }

  updateMyTelephone(telephone: string) {
    return this.http.patch(`${this.apiUrl}/etudiants/me/telephone`, {
      telephone,
    });
  }

  acceptStage(stageId: number) {
    return this.http.post(`${this.apiUrl}/etudiants/stages/${stageId}/accepter`, {});
  }
}