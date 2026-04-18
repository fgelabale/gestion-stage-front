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
  styleUrl: './stagiaire-bilan-fin-stage.css',
})
export class StagiaireBilanFinStageComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);

  readonly  taskQuestions = [
  {
    key: 'tachesEnLienAvecFormation',
    label: 'Les tâches assignées sont en lien avec ma formation.'
  },
  {
    key: 'tachesVariees',
    label: 'Les tâches sont variées.'
  },
  {
    key: 'tachesRecommencees',
    label: "J'ai dû recommencer une ou plusieurs tâches."
  },
  {
    key: 'retroactionRecue',
    label: "J'ai reçu de la rétroaction sur le travail effectué."
  },
  {
    key: 'progressionDansExecution',
    label: "J'ai progressé dans l’exécution de mes tâches."
  },
  {
    key: 'difficultesDansCertainesTaches',
    label: "J'ai rencontré des difficultés dans certaines tâches."
  },
  {
    key: 'respectSanteSecurite',
    label: "J'ai respecté les consignes de santé et sécurité au travail."
  }
];

 readonly reflectionQuestions = [
  {
    key: 'appreciationGlobaleTaches',
    label: "Dans l’ensemble, j'ai apprécié les tâches que j'ai pu effectuer."
  },
  {
    key: 'difficulteTachesCorrespondNiveau',
    label: "Le degré de difficulté de mes tâches correspondait à mon niveau de connaissance."
  },
  {
    key: 'nouvellesConnaissancesAcquises',
    label: "J'ai acquis de nouvelles connaissances durant mon stage."
  },
  {
    key: 'consolidationConnaissancesCompetences',
    label: "Mon stage m'a permis de consolider mes connaissances et mes compétences."
  },
  {
    key: 'stageUtileEtCompleteFormation',
    label: "Mon stage a été utile et complète bien ma formation."
  },
  {
    key: 'mieuxPrepareMarcheTravail',
    label: "Je me sens mieux préparé pour mon entrée sur le marché du travail."
  },
  {
    key: 'appreciationEchangesMaitreStage',
    label: "J'ai apprécié les échanges avec mon maître de stage."
  },
  {
    key: 'satisfactionStage',
    label: "Je suis satisfait de mon stage."
  }
];
  stageId = signal<number | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  successMessage = signal('');
  accessDenied = signal(false);
  loadErrorMessage = signal('');
  saveErrorMessage = signal('');

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
      this.saveErrorMessage.set('');
      this.loadErrorMessage.set('');
      this.accessDenied.set(false);

      if (!stageId || Number.isNaN(stageId)) {
        this.loadErrorMessage.set('Identifiant de stage invalide.');
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
      this.loadErrorMessage.set('Identifiant de stage invalide.');
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
          this.accessDenied.set(true);
          this.loadErrorMessage.set(
            "Vous n’avez pas accès à ce bilan fin de stage."
          );
        } else if (err?.status === 404) {
          this.accessDenied.set(true);
          this.loadErrorMessage.set('Cette action n\'est pas autorisée.');
        } else {
          this.loadErrorMessage.set(
            'Impossible de charger le bilan fin de stage.'
          );
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
    this.saveErrorMessage.set('');
    this.successMessage.set('');

    this.stagesService.upsertBilanFinStage(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Bilan fin de stage enregistré avec succès.');
        this.isSaving.set(false);
      },
      error: (err) => {
        if (err?.status === 403) {
          this.accessDenied.set(true);
          this.loadErrorMessage.set(
            "Vous n’avez pas accès à ce bilan fin de stage."
          );
        } else {
          this.saveErrorMessage.set(
            "Impossible d'enregistrer le bilan fin de stage."
          );
        }

        this.isSaving.set(false);
      },
    });
  }
}