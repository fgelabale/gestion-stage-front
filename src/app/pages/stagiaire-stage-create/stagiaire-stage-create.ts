import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StagesService } from '../../core/services/stage/stages.service';
import { PhoneMaskDirective } from '../../shared/directive/phone-mask';
import { PostalCodeMaskDirective } from '../../shared/directive/code-postal';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
export const timeRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const debut = group.get('heureDebut')?.value;
  const fin = group.get('heureFin')?.value;

  if (!debut || !fin) return null;

  return debut >= fin ? { timeRange: true } : null;
};

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const debut = group.get('dateDebut')?.value;
  const fin = group.get('dateFin')?.value;

  if (!debut || !fin) return null;

  return debut > fin ? { dateRange: true } : null;
};


@Component({
  selector: 'app-stagiaire-stage-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    PhoneMaskDirective,
    PostalCodeMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './stagiaire-stage-create.html',
  styleUrl: './stagiaire-stage-create.css',
})
export class StagiaireStageCreateComponent {
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);
  private router = inject(Router);

  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.nonNullable.group(
    {
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],

      entrepriseNom: ['', Validators.required],
      entrepriseNumeroRue: [''],
      entrepriseAdresseLigne2: [''],
      entrepriseNomRue: [''],
      entrepriseVille: [''],
      entrepriseProvince: [{ value: 'QC', disabled: true }],
      entrepriseCodePostal: [
        '',
        [Validators.pattern(/^[A-Z]\d[A-Z] \d[A-Z]\d$/)],
      ],
      entrepriseTelephone: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],

      contactStagePrenom: ['', Validators.required],
      contactStageNom: ['', Validators.required],
      contactStageCourriel: ['', [Validators.required, Validators.email]],
      contactStageTelephone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      contactStagePoste: [''],

      maitreStagePrenom: [''],
      maitreStageNom: [''],
      maitreStageCourriel: ['', Validators.email],
      maitreStageTelephone: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      maitreStagePoste: [''],
    },
    {
      validators: [timeRangeValidator, dateRangeValidator],
    }
  );

  submit(): void {
    const value = this.form.getRawValue();

    const hasContactStage =
      !!value.contactStagePrenom.trim() && !!value.contactStageNom.trim();

    const hasMaitreStage =
      !!value.maitreStagePrenom.trim() && !!value.maitreStageNom.trim();

    this.errorMessage.set('');

    if (!hasContactStage && !hasMaitreStage) {
      this.form.markAllAsTouched();
      this.errorMessage.set(
        'Veuillez saisir soit un contact de stage, soit un maître de stage.',
      );
      return;
    }

    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.successMessage.set('');

    this.stagesService.createStudentStage(value).subscribe({
      next: () => {
        this.successMessage.set('Stage créé avec succès.');
        this.isSaving.set(false);
        this.router.navigate(['/stagiaire']);
      },
      error: (err) => {
        const message = err?.error?.message;

        if (message?.includes('contactStageCourriel')) {
          this.form.controls.contactStageCourriel.setErrors({ server: true });
        }

        if (message?.includes('maitreStageCourriel')) {
          this.form.controls.maitreStageCourriel.setErrors({ server: true });
        }

        this.form.markAllAsTouched();
        this.errorMessage.set('Certains champs sont invalides.');
        this.isSaving.set(false);
      }
    });
  }
}