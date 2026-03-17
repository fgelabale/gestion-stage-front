import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StagesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
}