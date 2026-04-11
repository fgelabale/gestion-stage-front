import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccesExterneService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMaitreStageAccess(token: string) {
    return this.http.get(
      `${this.apiUrl}/acces-externe/maitre-stage/${token}`,
    );
  }

  saveMaitreStageEvaluationDraft(token: string, payload: any) {
    return this.http.post(
      `${this.apiUrl}/acces-externe/maitre-stage/${token}/evaluation/brouillon`,
      payload,
    );
  }

  submitMaitreStageEvaluationFinal(token: string, payload: any) {
    return this.http.post(
      `${this.apiUrl}/acces-externe/maitre-stage/${token}/evaluation/soumettre`,
      payload,
    );
  }
}