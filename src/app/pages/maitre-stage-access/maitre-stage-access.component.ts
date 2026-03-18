import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccesExterneService } from '../../core/services/accesExterne/acces-externe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';

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
  ],
  templateUrl: './maitre-stage-access.component.html',
})
export class MaitreStageAccessComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private accesExterneService = inject(AccesExterneService);

  token = signal<string>('');
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  stageData = signal<any | null>(null);

  noteOptions = [
    'EXCELLENT',
    'TRES_BIEN',
    'BIEN',
    'A_AMELIORER',
    'INSATISFAISANT',
    'NE_S_APPLIQUE_PAS',
  ];

  yesNoOptions = ['OUI', 'NON'];

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

    this.loadAccess();
  });
}

  get stage() {
    return computed(() => this.stageData()?.stage ?? null);
  }

  get evaluationExistante() {
    return computed(() => this.stageData()?.evaluationExistante ?? null);
  }

  private loadAccess(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accesExterneService.getMaitreStageAccess(this.token()).subscribe({
      next: (response: any) => {
        this.stageData.set(response);

        const evalExistante = response?.evaluationExistante;
        if (evalExistante) {
          this.form.patchValue({
            nomEntreprise: evalExistante.nomEntreprise ?? '',
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

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Lien invalide ou expiré.');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.accesExterneService
      .submitMaitreStageEvaluation(this.token(), this.form.getRawValue())
      .subscribe({
        next: () => {
          this.successMessage.set('Évaluation enregistrée avec succès.');
          this.isSaving.set(false);
        },
        error: () => {
          this.errorMessage.set("Impossible d'enregistrer l’évaluation.");
          this.isSaving.set(false);
        },
      });
  }
}