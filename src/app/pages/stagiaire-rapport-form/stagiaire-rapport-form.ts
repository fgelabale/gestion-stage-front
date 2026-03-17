import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StagesService } from '../../core/services/stage/stages.service';

@Component({
  selector: 'app-stagiaire-rapport-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './stagiaire-rapport-form.html',
})
export class StagiaireRapportFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);

  stageId = signal<number | null>(null);
  semaine = signal<number | null>(null);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  autonomieOptions = [
    'AUTONOME',
    'PARTIELLEMENT_AUTONOME',
    'ACCOMPAGNE',
    'OBSERVATEUR',
  ];

  form = this.fb.group({
    stageId: [0, [Validators.required]],
    numeroSemaine: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
    niveauAutonomie: ['', Validators.required],
    difficultes: [''],
    apprentissages: [''],
    solutions: [''],
    axesAmelioration: [''],
    taches: this.fb.array([]),
  });

  constructor() {
    const stageId = Number(this.route.snapshot.paramMap.get('id'));
    const semaine = Number(this.route.snapshot.paramMap.get('semaine'));

    if (!stageId || Number.isNaN(stageId) || !semaine || Number.isNaN(semaine)) {
      this.errorMessage.set('Paramètres invalides.');
      this.isLoading.set(false);
      return;
    }

    this.stageId.set(stageId);
    this.semaine.set(semaine);

    this.form.patchValue({
      stageId,
      numeroSemaine: semaine,
    });

    this.loadExistingRapport();
  }

  get tachesFormArray(): FormArray {
    return this.form.get('taches') as FormArray;
  }

  tachesControls = computed(() => this.tachesFormArray.controls);

  private createTacheGroup(data?: any) {
    return this.fb.group({
      description: [data?.description ?? '', Validators.required],
      logicielsUtilises: [data?.logicielsUtilises ?? ''],
    });
  }

  addTache(data?: any): void {
    this.tachesFormArray.push(this.createTacheGroup(data));
  }

  removeTache(index: number): void {
    this.tachesFormArray.removeAt(index);
  }

  private loadExistingRapport(): void {
    const stageId = this.stageId();
    const semaine = this.semaine();

    if (!stageId || !semaine) {
      this.errorMessage.set('Paramètres invalides.');
      this.isLoading.set(false);
      return;
    }

    this.stagesService.getRapportsByStage(stageId).subscribe({
      next: (response: any) => {
        const rapports = Array.isArray(response) ? response : [];
        const rapport = rapports.find((r: any) => r.numeroSemaine === semaine);

        this.tachesFormArray.clear();

        if (rapport) {
          this.form.patchValue({
            stageId: rapport.stageId,
            numeroSemaine: rapport.numeroSemaine,
            niveauAutonomie: rapport.niveauAutonomie ?? '',
            difficultes: rapport.difficultes ?? '',
            apprentissages: rapport.apprentissages ?? '',
            solutions: rapport.solutions ?? '',
            axesAmelioration: rapport.axesAmelioration ?? '',
          });

          if (rapport.taches?.length) {
            for (const tache of rapport.taches) {
              this.addTache(tache);
            }
          } else {
            this.addTache();
          }
        } else {
          this.addTache();
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le rapport.');
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

    this.stagesService.upsertRapportHebdomadaire(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Rapport enregistré avec succès.');
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set("Impossible d'enregistrer le rapport.");
        this.isSaving.set(false);
      },
    });
  }

  goToWeek(delta: number): void {
    const stageId = this.stageId();
    const currentWeek = this.semaine();

    if (!stageId || !currentWeek) return;

    const nextWeek = currentWeek + delta;

    if (nextWeek < 1 || nextWeek > 7) return;

    this.router.navigate(['/stagiaire/stages', stageId, 'rapport', nextWeek]);
  }
}