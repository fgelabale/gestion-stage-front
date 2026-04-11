import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AccesExterneService } from '../../core/services/accesExterne/acces-externe';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ConfirmSubmitDialogComponent } from './confirm-submit-dialog.component';

@Component({
  selector: 'app-maitre-stage-access',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    TranslocoModule,
    ConfirmSubmitDialogComponent,
  ],
  templateUrl: './maitre-stage-access.component.html',
  styleUrl: './maitre-stage-access.component.css',

})
export class MaitreStageAccessComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private accesExterneService = inject(AccesExterneService);
  private transloco = inject(TranslocoService);
  private dialog = inject(MatDialog);

  token = signal<string>('');
  isLoading = signal(true);
  isSavingDraft = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  stageData = signal<any | null>(null);
  submitAttempted = signal(false);

  noteOptions = [
    'EXCELLENT',
    'TRES_BIEN',
    'BIEN',
    'A_AMELIORER',
    'INSATISFAISANT',
    'NE_S_APPLIQUE_PAS',
  ];

  yesNoOptions = ['OUI', 'NON'];

  requiredFields = [
    'nomEntreprise',
    'nomCompletMaitreStage',
    'fonctionTitreMaitreStage',
    'nombreHeuresPresence',
    'respectDureePauses',
    'tachesEffectuees',
    'nombreAbsences',
    'nombreRetards',
    'nombreDepartsHatifs',
    'francaisParle',
    'francaisEcrit',
    'anglaisParle',
    'anglaisEcrit',
    'maitriseEquipementsInformatiques',
    'maitriseLogicielsInformatiques',
    'rapiditeExecution',
    'courtoisie',
    'capaciteAdaptation',
    'initiative',
    'espritCollaboration',
    'jugement',
    'sensResponsabilites',
    'autonomie',
    'respectEcheanciers',
    'sensOrganisation',
    'capaciteTravaillerSousPression',
    'tenueVestimentaire',
    'relationAutorite',
    'qualiteTravail',
    'relationCollegues',
    'faciliteApprentissage',
    'relationClientele',
    'commentaire',
    'elementsAmelioration',
    'aptitudesAppreciees',
  ];

  private validateFinalSubmitFields(): boolean {
    let hasErrors = false;

    for (const field of this.requiredFields) {
      const control = this.form.get(field);
      const value = control?.value;

      if (value === null || value === undefined || value === '') {
        control?.setErrors({ requiredForSubmit: true });
        control?.markAsTouched();
        hasErrors = true;
      } else if (control?.hasError('requiredForSubmit')) {
        control.setErrors(null);
      }
    }

    return !hasErrors;
  }
  hasSubmitError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!control && control.touched && control.hasError('requiredForSubmit');
  }
  private clearFinalSubmitErrors(): void {
    for (const field of this.requiredFields) {
      const control = this.form.get(field);
      if (control?.hasError('requiredForSubmit')) {
        control.setErrors(null);
      }
    }
  }

  form = this.fb.group({
    nomEntreprise: [''],
    nomCompletMaitreStage: [''],
    fonctionTitreMaitreStage: [''],
    nombreHeuresPresence: [null as number | null],
    nombreAbsences: [null as number | null],
    nombreRetards: [null as number | null],
    nombreDepartsHatifs: [null as number | null],
    respectDureePauses: [''],
    tachesEffectuees: [''],

    francaisParle: [''],
    francaisEcrit: [''],
    anglaisParle: [''],
    anglaisEcrit: [''],

    maitriseEquipementsInformatiques: [''],
    maitriseLogicielsInformatiques: [''],
    rapiditeExecution: [''],

    courtoisie: [''],
    capaciteAdaptation: [''],
    initiative: [''],
    espritCollaboration: [''],
    jugement: [''],
    sensResponsabilites: [''],
    autonomie: [''],
    respectEcheanciers: [''],
    sensOrganisation: [''],
    capaciteTravaillerSousPression: [''],
    tenueVestimentaire: [''],
    relationAutorite: [''],
    qualiteTravail: [''],
    relationCollegues: [''],
    faciliteApprentissage: [''],
    relationClientele: [''],

    aptitudesAppreciees: [''],
    elementsAmelioration: [''],
    commentaire: [''],
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token') ?? '';

      this.token.set(token);
      this.stageData.set(null);
      this.errorMessage.set('');
      this.successMessage.set('');
      this.isLoading.set(true);
      this.submitAttempted.set(false);

      this.resetForm();
      this.loadAccess();
    });
  }

  get stage() {
    return computed(() => this.stageData()?.stage ?? null);
  }

  get evaluationExistante() {
    return computed(() => this.stageData()?.evaluationExistante ?? null);
  }

  get isLocked() {
    return computed(() => this.evaluationExistante()?.statut === 'SOUMIS');
  }

  private resetForm(): void {
    this.form.reset({
      nomEntreprise: '',
      nomCompletMaitreStage: '',
      fonctionTitreMaitreStage: '',
      nombreHeuresPresence: null,
      nombreAbsences: null,
      nombreRetards: null,
      nombreDepartsHatifs: null,
      respectDureePauses: '',
      tachesEffectuees: '',
      francaisParle: '',
      francaisEcrit: '',
      anglaisParle: '',
      anglaisEcrit: '',
      maitriseEquipementsInformatiques: '',
      maitriseLogicielsInformatiques: '',
      rapiditeExecution: '',
      courtoisie: '',
      capaciteAdaptation: '',
      initiative: '',
      espritCollaboration: '',
      jugement: '',
      sensResponsabilites: '',
      autonomie: '',
      respectEcheanciers: '',
      sensOrganisation: '',
      capaciteTravaillerSousPression: '',
      tenueVestimentaire: '',
      relationAutorite: '',
      qualiteTravail: '',
      relationCollegues: '',
      faciliteApprentissage: '',
      relationClientele: '',
      aptitudesAppreciees: '',
      elementsAmelioration: '',
      commentaire: '',
    });
  }

  private applyFormState(): void {
    if (this.isLocked()) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  private loadAccess(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accesExterneService.getMaitreStageAccess(this.token()).subscribe({
      next: (response: any) => {
        this.stageData.set(response);
        const stage = response?.stage;
        const evalExistante = response?.evaluationExistante;
        if (evalExistante) {
          this.form.patchValue({
            nomEntreprise: evalExistante?.nomEntreprise ?? stage?.entreprise?.nom ?? '',
            nomCompletMaitreStage: evalExistante.nomCompletMaitreStage ?? '',
            fonctionTitreMaitreStage: evalExistante.fonctionTitreMaitreStage ?? '',
            nombreHeuresPresence: evalExistante.nombreHeuresPresence ?? null,
            nombreAbsences: evalExistante.nombreAbsences ?? null,
            nombreRetards: evalExistante.nombreRetards ?? null,
            nombreDepartsHatifs: evalExistante.nombreDepartsHatifs ?? null,
            respectDureePauses: evalExistante.respectDureePauses ?? '',
            tachesEffectuees: evalExistante.tachesEffectuees ?? '',

            francaisParle: evalExistante.francaisParle ?? '',
            francaisEcrit: evalExistante.francaisEcrit ?? '',
            anglaisParle: evalExistante.anglaisParle ?? '',
            anglaisEcrit: evalExistante.anglaisEcrit ?? '',

            maitriseEquipementsInformatiques:
              evalExistante.maitriseEquipementsInformatiques ?? '',
            maitriseLogicielsInformatiques:
              evalExistante.maitriseLogicielsInformatiques ?? '',
            rapiditeExecution: evalExistante.rapiditeExecution ?? '',

            courtoisie: evalExistante.courtoisie ?? '',
            capaciteAdaptation: evalExistante.capaciteAdaptation ?? '',
            initiative: evalExistante.initiative ?? '',
            espritCollaboration: evalExistante.espritCollaboration ?? '',
            jugement: evalExistante.jugement ?? '',
            sensResponsabilites: evalExistante.sensResponsabilites ?? '',
            autonomie: evalExistante.autonomie ?? '',
            respectEcheanciers: evalExistante.respectEcheanciers ?? '',
            sensOrganisation: evalExistante.sensOrganisation ?? '',
            capaciteTravaillerSousPression:
              evalExistante.capaciteTravaillerSousPression ?? '',
            tenueVestimentaire: evalExistante.tenueVestimentaire ?? '',
            relationAutorite: evalExistante.relationAutorite ?? '',
            qualiteTravail: evalExistante.qualiteTravail ?? '',
            relationCollegues: evalExistante.relationCollegues ?? '',
            faciliteApprentissage: evalExistante.faciliteApprentissage ?? '',
            relationClientele: evalExistante.relationClientele ?? '',

            aptitudesAppreciees: evalExistante.aptitudesAppreciees ?? '',
            elementsAmelioration: evalExistante.elementsAmelioration ?? '',
            commentaire: evalExistante.commentaire ?? '',
          });
        }

        this.applyFormState();
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          this.transloco.translate('mentorEvaluation.messages.invalidLink')
        );
        this.isLoading.set(false);
      },
    });
  }

  private normalizePayload(payload: any) {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ]),
    );
  }


  saveDraft(): void {
    if (this.isSavingDraft() || this.isSubmitting() || this.isLocked()) return;
    this.clearFinalSubmitErrors();
    this.isSavingDraft.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.submitAttempted.set(false);

    this.accesExterneService
      .saveMaitreStageEvaluationDraft(this.token(), this.normalizePayload(this.form.getRawValue()))
      .subscribe({
        next: () => {
          this.successMessage.set(
            this.transloco.translate('mentorEvaluation.messages.draftSaved')
          );
          this.isSavingDraft.set(false);
          this.loadAccess();
        },
        error: () => {
          this.errorMessage.set(
            this.transloco.translate('mentorEvaluation.messages.saveError')
          );
          this.isSavingDraft.set(false);
        },
      });
  }

  submitFinal(): void {
    if (this.isSavingDraft() || this.isSubmitting() || this.isLocked()) return;

    this.successMessage.set('');
    this.errorMessage.set('');

    const isValid = this.validateFinalSubmitFields();

    if (!isValid) {
      this.errorMessage.set(
        this.transloco.translate('mentorEvaluation.messages.formInvalid')
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmSubmitDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        message: this.transloco.translate('mentorEvaluation.confirmSubmitMessage'),
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.isSubmitting.set(true);

      this.accesExterneService
        .submitMaitreStageEvaluationFinal(
          this.token(),
          this.normalizePayload(this.form.getRawValue())
        )
        .subscribe({
          next: () => {
            this.successMessage.set(
              this.transloco.translate('mentorEvaluation.messages.submitted')
            );
            this.isSubmitting.set(false);
            this.loadAccess();
          },
          error: (err) => {
            const backendMessage = err?.error?.message;

            this.errorMessage.set(
              Array.isArray(backendMessage)
                ? backendMessage.join(', ')
                : backendMessage ||
                this.transloco.translate('mentorEvaluation.messages.submitError')
            );

            this.isSubmitting.set(false);
          },
        });
    });
  }
}