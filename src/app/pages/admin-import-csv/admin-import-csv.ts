import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ImportCsvService } from '../../core/services/import-csv/import-csv';

@Component({
  selector: 'app-admin-import-csv',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './admin-import-csv.html',
})
export class AdminImportCsvComponent {
  private importCsvService = inject(ImportCsvService);

  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isValidating = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  result = signal<any | null>(null);
  validationResult = signal<any | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile.set(file);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.result.set(null);
    this.validationResult.set(null);
  }

  validate(): void {
    const file = this.selectedFile();

    if (!file) {
      this.errorMessage.set('Veuillez sélectionner un fichier CSV.');
      return;
    }

    this.isValidating.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.validationResult.set(null);

    this.importCsvService.validateCsv(file).subscribe({
      next: (response) => {
        this.validationResult.set(response);
        this.isValidating.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Impossible de valider le fichier CSV.',
        );
        this.isValidating.set(false);
      },
    });
  }

  upload(): void {
    const file = this.selectedFile();

    if (!file) {
      this.errorMessage.set('Veuillez sélectionner un fichier CSV.');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.result.set(null);

    this.importCsvService.importCsv(file).subscribe({
      next: (response) => {
        this.result.set(response);
        this.successMessage.set('Import terminé.');
        this.isUploading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || "Impossible d'importer le fichier CSV.",
        );
        this.isUploading.set(false);
      },
    });
  }
}