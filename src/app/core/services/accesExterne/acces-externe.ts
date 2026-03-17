import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccesExterneService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMaitreStageAccess(token: string) {
    return this.http.get(`${this.apiUrl}/acces-externe/maitre-stage/${token}`);
  }

  submitMaitreStageEvaluation(token: string, payload: any) {
    return this.http.post(
      `${this.apiUrl}/acces-externe/maitre-stage/${token}/evaluation`,
      payload,
    );
  }
}