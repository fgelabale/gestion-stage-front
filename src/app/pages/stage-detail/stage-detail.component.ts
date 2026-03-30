import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { PdfService } from '../../core/services/pdf/pdf.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../../core/services/users/users';
import { GroupesService } from '../../core/services/groupes/groupes';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-stage-detail',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,],
  templateUrl: './stage-detail.component.html',
})
export class StageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private stagesService = inject(StagesService);
  private pdfService = inject(PdfService);
  private usersService = inject(UsersService);
  private groupesService = inject(GroupesService);
  private fb = inject(FormBuilder);

  etatOptions = ['EN_COURS', 'PRE_VALIDE', 'ENTENTE_RECUE', 'ACCEPTE', 'ANNULE'];

  etatForm = this.fb.nonNullable.group({
    etat: ['EN_COURS', Validators.required],
  });

  isSavingEtat = signal(false);
  successEtatMessage = signal('');

  data = signal<any | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  groupes = signal<any[]>([]);
  superviseurs = signal<any[]>([]);
  isSavingAdmin = signal(false);
  successAdminMessage = signal('');

  adminForm = this.fb.group({
    telephoneEtudiant: [''],
    groupeId: [null as number | null],

    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    heureDebut: [''],
    heureFin: [''],
    etat: ['EN_COURS', Validators.required],
    superviseurId: [null as number | null],

    entrepriseNom: [''],
    entrepriseNumeroRue: [''],
    entrepriseAdresseLigne2: [''],
    entrepriseNomRue: [''],
    entrepriseVille: [''],
    entrepriseProvince: [''],
    entrepriseCodePostal: [''],
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

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const stageId = Number(params.get('id'));
      this.loadStage(stageId);
      this.loadAuxiliaryData();
    });
  }

  ngOnInit(): void {
    const stageId = Number(this.route.snapshot.paramMap.get('id'));

    if (!stageId || Number.isNaN(stageId)) {
      this.errorMessage.set('Identifiant de stage invalide.');
      this.isLoading.set(false);
      return;
    }

    this.stagesService.getStageDetail(stageId).subscribe({
      next: (response) => {
        this.data.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le détail du stage.');
        this.isLoading.set(false);
      },
    });

  }

  private toDateInputValue(value: string | Date | null | undefined): string {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
  }
  downloadPdf(): void {
    const stageId = this.data()?.stage?.id;

    if (stageId) {
      this.pdfService.downloadStagePdf(stageId);
    }
  }

  loadStage(stageId: number): void {
    this.data.set(null);
    this.errorMessage.set('');

    if (!stageId || Number.isNaN(stageId)) {
      this.errorMessage.set('Identifiant de stage invalide.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    this.stagesService.getStageDetail(stageId).subscribe({
      next: (response) => {
        this.data.set(response);
        this.isLoading.set(false);
        this.etatForm.patchValue({
          etat: response?.stage?.etat ?? response?.etat ?? 'EN_COURS',
        });


        const stage = response.stage;

        this.adminForm.patchValue({
          telephoneEtudiant: stage.etudiant?.telephone ?? '',
          groupeId: stage.etudiant?.groupeId ?? null,

          dateDebut: this.toDateInputValue(stage.dateDebut),
          dateFin: this.toDateInputValue(stage.dateFin),
          heureDebut: stage.heureDebut ?? '',
          heureFin: stage.heureFin ?? '',
          //etat: stage.etat ?? '',
          superviseurId: stage.superviseurId ?? null,

          entrepriseNom: stage.entreprise?.nom ?? '',
          entrepriseNumeroRue: stage.entreprise?.numeroRue ?? '',
          entrepriseAdresseLigne2: stage.entreprise?.adresseLigne2 ?? '',
          entrepriseNomRue: stage.entreprise?.nomRue ?? '',
          entrepriseVille: stage.entreprise?.ville ?? '',
          entrepriseProvince: stage.entreprise?.province ?? '',
          entrepriseCodePostal: stage.entreprise?.codePostal ?? '',
          entrepriseTelephone: stage.entreprise?.telephone ?? '',

          contactStagePrenom: stage.contactStage?.prenom ?? '',
          contactStageNom: stage.contactStage?.nom ?? '',
          contactStageCourriel: stage.contactStage?.courriel ?? '',
          contactStageTelephone: stage.contactStage?.telephone ?? '',
          contactStagePoste: stage.contactStage?.poste ?? '',

          maitreStagePrenom: stage.maitreStage?.prenom ?? '',
          maitreStageNom: stage.maitreStage?.nom ?? '',
          maitreStageCourriel: stage.maitreStage?.courriel ?? '',
          maitreStageTelephone: stage.maitreStage?.telephone ?? '',
          maitreStagePoste: stage.maitreStage?.poste ?? '',
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le détail du stage.');
        this.isLoading.set(false);
      },
    });
  }

  saveEtat(stageId: number): void {
    if (this.etatForm.invalid || this.isSavingEtat()) {
      return;
    }

    this.isSavingEtat.set(true);
    this.errorMessage.set('');
    this.successEtatMessage.set('');

    this.stagesService
      .updateStageEtat(stageId, this.etatForm.getRawValue().etat)
      .subscribe({
        next: () => {
          this.successEtatMessage.set('État mis à jour.');
          this.isSavingEtat.set(false);
          this.loadStage(stageId);
        },
        error: () => {
          this.errorMessage.set("Impossible de mettre à jour l'état.");
          this.isSavingEtat.set(false);
        },
      });
  }

  loadAuxiliaryData(): void {
    this.groupesService.getGroupes().subscribe({
      next: (groupes: any) => this.groupes.set(groupes ?? []),
    });

    this.usersService.getSuperviseurs().subscribe({
      next: (superviseurs: any) => this.superviseurs.set(superviseurs ?? []),
    });
  }

  formatEtat(value: string): string {
    switch (value) {
      case 'EN_COURS':
        return 'En traitement';
      case 'PRE_VALIDE':
        return 'Pré-validé';
      case 'ENTENTE_RECUE':
        return 'Entente reçue';
      case 'ACCEPTE':
        return 'Accepté';
      case 'ANNULE':
        return 'Annulé';
      default:
        return value;
    }
  }

  saveFullStage(stageId: number): void {
    if (this.isSavingAdmin()) return;

    this.isSavingAdmin.set(true);
    this.errorMessage.set('');
    this.successAdminMessage.set('');

    this.stagesService.updateStageAdmin(stageId, this.adminForm.getRawValue()).subscribe({
      next: (updated: any) => {
        this.successAdminMessage.set('Stage mis à jour.');
        this.isSavingAdmin.set(false);

        const response = { stage: updated };
        this.data.set(response);

        this.adminForm.patchValue({
          telephoneEtudiant: updated?.etudiant?.telephone ?? '',
          groupeId: updated?.etudiant?.groupeId ?? null,
          dateDebut: this.toDateInputValue(updated?.dateDebut),
          dateFin: this.toDateInputValue(updated?.dateFin),
          heureDebut: updated?.heureDebut ?? '',
          heureFin: updated?.heureFin ?? '',
          //etat: updated?.etat ?? 'EN_COURS',
          superviseurId: updated?.superviseurId ?? null,
          entrepriseNom: updated?.entreprise?.nom ?? '',
          entrepriseNomRue: updated?.entreprise?.entrepriseNomRue ?? '',
          entrepriseNumeroRue: updated?.entreprise?.entrepriseNumeroRue ?? '',
          entrepriseAdresseLigne2: updated?.entreprise?.adresseLigne2 ?? '',
          entrepriseVille: updated?.entreprise?.entrepriseVille ?? '',
          entrepriseProvince: updated?.entreprise?.entrepriseProvince ?? '',
          entrepriseCodePostal: updated?.entreprise?.entrepriseProvince ?? '',
          entrepriseTelephone: updated?.entreprise?.telephone ?? '',
          contactStagePrenom: updated?.contactStage?.prenom ?? '',
          contactStageNom: updated?.contactStage?.nom ?? '',
          contactStageCourriel: updated?.contactStage?.courriel ?? '',
          contactStageTelephone: updated?.contactStage?.telephone ?? '',
          contactStagePoste: updated?.contactStage?.poste ?? '',
          maitreStagePrenom: updated?.maitreStage?.prenom ?? '',
          maitreStageNom: updated?.maitreStage?.nom ?? '',
          maitreStageCourriel: updated?.maitreStage?.courriel ?? '',
          maitreStageTelephone: updated?.maitreStage?.telephone ?? '',
          maitreStagePoste: updated?.maitreStage?.poste ?? '',
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de mettre à jour le stage.');
        this.isSavingAdmin.set(false);
      },
    });
  }
}