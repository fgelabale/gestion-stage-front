import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StagesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStagesManquants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tableau-synthese/admin/manquants`);
  }

  getStageDetail(stageId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tableau-synthese/stage/${stageId}`);
  }

  getMesStages() {
    return this.http.post(`${this.apiUrl}/stages/mes-stages`, {});
  }

  getMonStageDetail(stageId: number) {
    return this.http.post(`${this.apiUrl}/stages/mon-stage/${stageId}`, {});
  }

  getRapportsByStage(stageId: number) {
    return this.http.get(
      `${this.apiUrl}/rapports-hebdomadaires/stage/${stageId}`,
      {},
    );
  }

  upsertRapportHebdomadaire(payload: any) {
    return this.http.post(`${this.apiUrl}/rapports-hebdomadaires`, payload);
  }

  getBilanMiStage(stageId: number) {
    return this.http.get(`${this.apiUrl}/bilan-mi-stage/stage/${stageId}`);
  }

  upsertBilanMiStage(payload: any) {
    return this.http.post(`${this.apiUrl}/bilan-mi-stage`, payload);
  }

  getBilanFinStage(stageId: number) {
  return this.http.get(`${this.apiUrl}/bilan-fin-stage/stage/${stageId}`);
}

upsertBilanFinStage(payload: any) {
  return this.http.post(`${this.apiUrl}/bilan-fin-stage`, payload);
}
}