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
})
export class StagiaireBilanMiStageComponent {
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
    const stageId = Number(this.route.snapshot.paramMap.get('id'));

    if (!stageId || Number.isNaN(stageId)) {
      this.errorMessage.set('Identifiant de stage invalide.');
      this.isLoading.set(false);
      return;
    }

    this.stageId.set(stageId);
    this.form.patchValue({ stageId });

    this.loadBilan();
  }

  private loadBilan(): void {
    const stageId = this.stageId();

    if (!stageId) {
      this.errorMessage.set('Identifiant de stage invalide.');
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
      error: () => {
        this.errorMessage.set('Impossible de charger le bilan mi-stage.');
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

    this.stagesService.upsertBilanMiStage(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Bilan mi-stage enregistré avec succès.');
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set("Impossible d'enregistrer le bilan mi-stage.");
        this.isSaving.set(false);
      },
    });
  }
}