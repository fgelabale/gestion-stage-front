import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EtudiantsService } from '../../core/services/etudiants/etudiants.service';

@Component({
  selector: 'app-stagiaire-profil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './stagiaire-profil.html',
})
export class StagiaireProfilComponent {
  private fb = inject(FormBuilder);
  private etudiantsService = inject(EtudiantsService);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  profile = signal<any | null>(null);

  form = this.fb.nonNullable.group({
    telephone: ['', Validators.required],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.etudiantsService.getMyProfile().subscribe({
      next: (response: any) => {
        this.profile.set(response);
        this.form.patchValue({
          telephone: response?.telephone ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le profil.');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.etudiantsService
      .updateMyTelephone(this.form.getRawValue().telephone)
      .subscribe({
        next: () => {
          this.successMessage.set('Téléphone mis à jour.');
          this.isSaving.set(false);
        },
        error: () => {
          this.errorMessage.set('Impossible de mettre à jour le téléphone.');
          this.isSaving.set(false);
        },
      });
  }
}