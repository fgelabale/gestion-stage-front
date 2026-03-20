import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImportCsvService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  importCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/import-csv`, formData);
  }

  validateCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/import-csv/validate`, formData);
  }
}