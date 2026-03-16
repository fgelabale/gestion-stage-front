import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  downloadStagePdf(stageId: number): void {
    this.http
      .get(`${this.apiUrl}/pdf/stage/${stageId}`, {
        responseType: 'blob',
      })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stage-${stageId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}