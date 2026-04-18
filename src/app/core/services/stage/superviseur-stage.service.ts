import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuperviseurStageService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMesStages() {
    return this.http.get<{ stages: any[] }>(`${this.apiUrl}/superviseur/mes-stages`);
  }

  getStageDetail(stageId: number) {
    return this.http.get(`${this.apiUrl}/superviseur/stages/${stageId}`);
  }

  getVisites(stageId: number) {
    return this.http.get(`${this.apiUrl}/visite-superviseur/stage/${stageId}`);
  }

  saveVisite(dto: any) {
    return this.http.post(`${this.apiUrl}/visite-superviseur/create`, dto);
  }

  getBilanMiStage(stageId: number) {
    return this.http.get(`${this.apiUrl}/bilan-mi-stage/stage/${stageId}`);
  }

  getBilanFinStage(stageId: number) {
    return this.http.get(`${this.apiUrl}/bilan-fin-stage/stage/${stageId}/admin`);
  }

  getEvaluationMaitreStage(stageId: number) {
    return this.http.get(`${this.apiUrl}/evaluation-maitre-stage/stage/${stageId}`);
  }

  downloadBilanMiStagePdf(stageId: number) {
    return this.http.get(`${this.apiUrl}/pdf/bilan-mi-stage/${stageId}`, {
      responseType: 'blob',
    });
  }

  downloadBilanFinStagePdf(stageId: number) {
    return this.http.get(`${this.apiUrl}/pdf/bilan-fin-stage/${stageId}`, {
      responseType: 'blob',
    });
  }

  downloadEvaluationMaitreStagePdf(stageId: number) {
    return this.http.get(`${this.apiUrl}/pdf/evaluation-maitre-stage/${stageId}`, {
      responseType: 'blob',
    });
  }

  downloadVisiteSuperviseurPdf(stageId: number) {
    return this.http.get(`${this.apiUrl}/pdf/visite-superviseur/${stageId}`, {
      responseType: 'blob',
    });
  }
}