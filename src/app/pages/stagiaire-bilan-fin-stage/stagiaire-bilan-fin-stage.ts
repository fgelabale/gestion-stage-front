import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { StagesService } from '../../core/services/stage/stages.service';

@Component({
  selector: 'app-stagiaire-bilan-fin-stage',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  templateUrl: './stagiaire-bilan-fin-stage.html',
})
export class StagiaireBilanFinStageComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);

  stageId = signal<number | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  yesNoOptions = ['OUI', 'NON'];

  form = this.fb.group({
    stageId: [0, [Validators.required]],

    tachesEnLienAvecFormation: ['', Validators.required],
    tachesVariees: ['', Validators.required],
    tachesRecommencees: ['', Validators.required],
    retroactionRecue: ['', Validators.required],
    progressionDansExecution: ['', Validators.required],
    difficultesDansCertainesTaches: ['', Validators.required],
    respectSanteSecurite: ['', Validators.required],

    appreciationGlobaleTaches: ['', Validators.required],
    difficulteTachesCorrespondNiveau: ['', Validators.required],
    nouvellesConnaissancesAcquises: ['', Validators.required],
    consolidationConnaissancesCompetences: ['', Validators.required],
    stageUtileEtCompleteFormation: ['', Validators.required],
    mieuxPrepareMarcheTravail: ['', Validators.required],
    appreciationEchangesMaitreStage: ['', Validators.required],
    satisfactionStage: ['', Validators.required],

    integrationEntrepriseEvolution: [''],
    actionsIntegrationDeuxiemePartie: [''],
    formationAdequationMondeProfessionnel: [''],
    competencesADevelopper: [''],
    competenceCapitale: [''],
    pointsFortsDeuxiemePartie: [''],
    elementsAAmeliorerFuturEmploi: [''],
    perceptionMetierEvolution: [''],
    confirmationChoixCarriere: [''],
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const stageId = Number(params.get('id'));

      this.successMessage.set('');
      this.errorMessage.set('');

      if (!stageId || Number.isNaN(stageId)) {
        this.errorMessage.set('Identifiant de stage invalide.');
        this.isLoading.set(false);
        return;
      }

      this.stageId.set(stageId);
      this.form.reset({
        stageId,
        tachesEnLienAvecFormation: '',
        tachesVariees: '',
        tachesRecommencees: '',
        retroactionRecue: '',
        progressionDansExecution: '',
        difficultesDansCertainesTaches: '',
        respectSanteSecurite: '',
        appreciationGlobaleTaches: '',
        difficulteTachesCorrespondNiveau: '',
        nouvellesConnaissancesAcquises: '',
        consolidationConnaissancesCompetences: '',
        stageUtileEtCompleteFormation: '',
        mieuxPrepareMarcheTravail: '',
        appreciationEchangesMaitreStage: '',
        satisfactionStage: '',
        integrationEntrepriseEvolution: '',
        actionsIntegrationDeuxiemePartie: '',
        formationAdequationMondeProfessionnel: '',
        competencesADevelopper: '',
        competenceCapitale: '',
        pointsFortsDeuxiemePartie: '',
        elementsAAmeliorerFuturEmploi: '',
        perceptionMetierEvolution: '',
        confirmationChoixCarriere: '',
      });

      this.isLoading.set(true);
      this.loadBilan();
    });
  }

  private loadBilan(): void {
    const stageId = this.stageId();

    if (!stageId) {
      this.errorMessage.set('Identifiant de stage invalide.');
      this.isLoading.set(false);
      return;
    }

    this.stagesService.getBilanFinStage(stageId).subscribe({
      next: (response: any) => {
        if (response) {
          this.form.patchValue({
            stageId: response.stageId ?? stageId,
            tachesEnLienAvecFormation: response.tachesEnLienAvecFormation ?? '',
            tachesVariees: response.tachesVariees ?? '',
            tachesRecommencees: response.tachesRecommencees ?? '',
            retroactionRecue: response.retroactionRecue ?? '',
            progressionDansExecution: response.progressionDansExecution ?? '',
            difficultesDansCertainesTaches:
              response.difficultesDansCertainesTaches ?? '',
            respectSanteSecurite: response.respectSanteSecurite ?? '',

            appreciationGlobaleTaches: response.appreciationGlobaleTaches ?? '',
            difficulteTachesCorrespondNiveau:
              response.difficulteTachesCorrespondNiveau ?? '',
            nouvellesConnaissancesAcquises:
              response.nouvellesConnaissancesAcquises ?? '',
            consolidationConnaissancesCompetences:
              response.consolidationConnaissancesCompetences ?? '',
            stageUtileEtCompleteFormation:
              response.stageUtileEtCompleteFormation ?? '',
            mieuxPrepareMarcheTravail:
              response.mieuxPrepareMarcheTravail ?? '',
            appreciationEchangesMaitreStage:
              response.appreciationEchangesMaitreStage ?? '',
            satisfactionStage: response.satisfactionStage ?? '',

            integrationEntrepriseEvolution:
              response.integrationEntrepriseEvolution ?? '',
            actionsIntegrationDeuxiemePartie:
              response.actionsIntegrationDeuxiemePartie ?? '',
            formationAdequationMondeProfessionnel:
              response.formationAdequationMondeProfessionnel ?? '',
            competencesADevelopper: response.competencesADevelopper ?? '',
            competenceCapitale: response.competenceCapitale ?? '',
            pointsFortsDeuxiemePartie:
              response.pointsFortsDeuxiemePartie ?? '',
            elementsAAmeliorerFuturEmploi:
              response.elementsAAmeliorerFuturEmploi ?? '',
            perceptionMetierEvolution:
              response.perceptionMetierEvolution ?? '',
            confirmationChoixCarriere:
              response.confirmationChoixCarriere ?? '',
          });
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        if (err?.status === 403) {
          this.errorMessage.set(
            "Ce bilan fin-stage est disponible seulement pour un stage à l'état ACCEPTE.",
          );
        } else {
          this.errorMessage.set('Impossible de charger le bilan fin de stage.');
        }
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

    this.stagesService.upsertBilanFinStage(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Bilan fin de stage enregistré avec succès.');
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set("Impossible d'enregistrer le bilan fin de stage.");
        this.isSaving.set(false);
      },
    });
  }
}