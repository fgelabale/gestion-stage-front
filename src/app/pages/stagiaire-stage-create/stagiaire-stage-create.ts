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
    titre: [''],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    heureDebut: [''],
    heureFin: [''],

    entrepriseNom: ['', Validators.required],
    entrepriseAdresse: [''],
    entrepriseTelephone: [''],

    contactStagePrenom: ['', Validators.required],
    contactStageNom: ['', Validators.required],
    contactStageCourriel: [''],
    contactStageTelephone: [''],
    contactStagePoste: [''],

    maitreStagePrenom: ['', Validators.required],
    maitreStageNom: ['', Validators.required],
    maitreStageCourriel: [''],
    maitreStageTelephone: [''],
    maitreStagePoste: [''],
  });

  submit(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.stagesService.createStudentStage(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Stage créé avec succès.');
        this.isSaving.set(false);
        this.router.navigate(['/stagiaire']);
      },
      error: () => {
        this.errorMessage.set('Impossible de créer le stage.');
        this.isSaving.set(false);
      },
    });
  }
}