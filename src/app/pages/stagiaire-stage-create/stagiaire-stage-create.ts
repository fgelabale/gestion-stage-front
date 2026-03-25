import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StagesService } from '../../core/services/stage/stages.service';

@Component({
  selector: 'app-stagiaire-stage-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './stagiaire-stage-create.html',
})
export class StagiaireStageCreateComponent {
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);
  private router = inject(Router);

  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.nonNullable.group({
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    heureDebut: [''],
    heureFin: [''],

    entrepriseNom: ['', Validators.required],
    entrepriseNumeroRue: [''],
    entrepriseAdresseLigne2: [''],
    entrepriseNomRue: [''],
    entrepriseVille: [''],
    entrepriseProvince: [''],
    entrepriseCodePostal: [
      '',
      [Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)],
    ],
    entrepriseTelephone: [''],

    contactStagePrenom: [''],
    contactStageNom: [''],
    contactStageCourriel: [''],
    contactStageTelephone: [''],
    contactStagePoste: [''],

    maitreStagePrenom: [''],
    maitreStageNom: [''],
    maitreStageCourriel: [''],
    maitreStageTelephone: [''],
    maitreStagePoste: [''],
  });

  submit(): void {
    const value = this.form.getRawValue();

    const hasContactStage =
      !!value.contactStagePrenom.trim() && !!value.contactStageNom.trim();

    const hasMaitreStage =
      !!value.maitreStagePrenom.trim() && !!value.maitreStageNom.trim();

    if ((!hasContactStage && !hasMaitreStage) || this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      if (!hasContactStage && !hasMaitreStage) {
        this.errorMessage.set(
          'Veuillez saisir soit un contact de stage, soit un maître de stage.',
        );
      }
      return;
    }

    if (this.form.controls.entrepriseCodePostal.invalid) {
      this.errorMessage.set('Le code postal doit respecter le format canadien A1A 1A1.');
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.stagesService.createStudentStage(value).subscribe({
      next: () => {
        this.successMessage.set('Stage créé avec succès.');
        this.isSaving.set(false);
        this.router.navigate(['/stagiaire']);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Impossible de créer le stage.',
        );
        this.isSaving.set(false);
      },
    });
  }
}