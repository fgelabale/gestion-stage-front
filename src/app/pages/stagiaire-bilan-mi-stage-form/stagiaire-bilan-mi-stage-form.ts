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
  selector: 'app-stagiaire-bilan-mi-stage',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './stagiaire-bilan-mi-stage-form.html',
  styleUrl: './stagiaire-bilan-mi-stage-form.css',
})
export class StagiaireBilanMiStageComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private stagesService = inject(StagesService);

  stageId = signal<number | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);

  accessDenied = signal(false);
  loadErrorMessage = signal('');
  saveErrorMessage = signal('');
  successMessage = signal('');

  yesNoOptions = ['OUI', 'NON'];

  form = this.fb.group({
    stageId: [0, [Validators.required]],

    accueilParMaitreStage: ['', Validators.required],
    espaceTravailAssigne: ['', Validators.required],
    visiteDesLieux: ['', Validators.required],
    presentationAuxEmployes: ['', Validators.required],
    ambianceTravailBonne: ['', Validators.required],
    consignesMaitreStageComprises: ['', Validators.required],
    reglesEntrepriseComprises: ['', Validators.required],
    aisePoserQuestions: ['', Validators.required],
    accueilApprecie: ['', Validators.required],

    tachesEnLienAvecFormation: ['', Validators.required],
    tachesVariees: ['', Validators.required],
    tachesRecommencees: ['', Validators.required],
    retroactionRecue: ['', Validators.required],
    progressionDansExecution: ['', Validators.required],
    difficultesDansCertainesTaches: ['', Validators.required],
    respectSanteSecurite: ['', Validators.required],

    integrationEntrepriseCommentaire: [''],
    actionsIntegrationEquipe: [''],
    miseEnPratiqueSanteSecurite: [''],
    pointsFortsPremierePartie: [''],
    elementsAAmeliorerDeuxiemePartie: [''],
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
        accueilParMaitreStage: '',
        espaceTravailAssigne: '',
        visiteDesLieux: '',
        presentationAuxEmployes: '',
        ambianceTravailBonne: '',
        consignesMaitreStageComprises: '',
        reglesEntrepriseComprises: '',
        aisePoserQuestions: '',
        accueilApprecie: '',
        tachesEnLienAvecFormation: '',
        tachesVariees: '',
        tachesRecommencees: '',
        retroactionRecue: '',
        progressionDansExecution: '',
        difficultesDansCertainesTaches: '',
        respectSanteSecurite: '',
        integrationEntrepriseCommentaire: '',
        actionsIntegrationEquipe: '',
        miseEnPratiqueSanteSecurite: '',
        pointsFortsPremierePartie: '',
        elementsAAmeliorerDeuxiemePartie: '',
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

    this.stagesService.getBilanMiStage(stageId).subscribe({
      next: (response: any) => {
        if (response) {
          this.form.patchValue({
            stageId: response.stageId ?? stageId,
            accueilParMaitreStage: response.accueilParMaitreStage ?? '',
            espaceTravailAssigne: response.espaceTravailAssigne ?? '',
            visiteDesLieux: response.visiteDesLieux ?? '',
            presentationAuxEmployes: response.presentationAuxEmployes ?? '',
            ambianceTravailBonne: response.ambianceTravailBonne ?? '',
            consignesMaitreStageComprises: response.consignesMaitreStageComprises ?? '',
            reglesEntrepriseComprises: response.reglesEntrepriseComprises ?? '',
            aisePoserQuestions: response.aisePoserQuestions ?? '',
            accueilApprecie: response.accueilApprecie ?? '',
            tachesEnLienAvecFormation: response.tachesEnLienAvecFormation ?? '',
            tachesVariees: response.tachesVariees ?? '',
            tachesRecommencees: response.tachesRecommencees ?? '',
            retroactionRecue: response.retroactionRecue ?? '',
            progressionDansExecution: response.progressionDansExecution ?? '',
            difficultesDansCertainesTaches:
              response.difficultesDansCertainesTaches ?? '',
            respectSanteSecurite: response.respectSanteSecurite ?? '',
            integrationEntrepriseCommentaire:
              response.integrationEntrepriseCommentaire ?? '',
            actionsIntegrationEquipe: response.actionsIntegrationEquipe ?? '',
            miseEnPratiqueSanteSecurite:
              response.miseEnPratiqueSanteSecurite ?? '',
            pointsFortsPremierePartie:
              response.pointsFortsPremierePartie ?? '',
            elementsAAmeliorerDeuxiemePartie:
              response.elementsAAmeliorerDeuxiemePartie ?? '',
          });
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        if (err?.status === 403) {
          this.accessDenied.set(true);
          this.loadErrorMessage.set(
            "Vous n’avez pas accès à ce bilan mi-stage."
          );
        } else if (err?.status === 404) {
          this.accessDenied.set(true);
          this.loadErrorMessage.set('Cette action n\'est pas autorisé.');
        } else {
          this.loadErrorMessage.set(
            'Impossible de charger le bilan mi-stage.'
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

    this.stagesService.upsertBilanMiStage(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Bilan mi-stage enregistré avec succès.');
        this.isSaving.set(false);
      },
      error: (err) => {
        if (err?.status === 403) {
          this.accessDenied.set(true);
          this.loadErrorMessage.set(
            "Vous n’avez pas accès à ce bilan mi-stage."
          );
        } else {
          this.saveErrorMessage.set(
            "Impossible d'enregistrer le bilan mi-stage."
          );
        }

        this.isSaving.set(false);
      },
    });
  }
}