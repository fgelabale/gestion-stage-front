import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { getStageEtatUi } from '../../shared/helper/stage-etat.util';
import { SuperviseurStageService } from '../../core/services/stage/superviseur-stage.service';
@Component({
  selector: 'app-supervisor-stage-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    TranslocoModule,
    MatIconModule,
  ],
  templateUrl: './supervisor-stage-detail.component.html',
  styleUrl: './supervisor-stage-detail.component.css',
})
export class SupervisorStageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private service = inject(SuperviseurStageService);

  stageId = signal<number>(0);
  stage = signal<any | null>(null);
  bilanMiStage = signal<any | null>(null);
  bilanFinStage = signal<any | null>(null);
  evaluationMaitreStage = signal<any | null>(null);

  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  visibleInterviewCount = signal(1);
  form1 = this.createEntrevueForm(1);
  form2 = this.createEntrevueForm(2);
  form3 = this.createEntrevueForm(3);

  ngOnInit(): void {
    const stageId = Number(this.route.snapshot.paramMap.get('stageId'));
    this.stageId.set(stageId);

    this.form1.patchValue({ stageId });
    this.form2.patchValue({ stageId });
    this.form3.patchValue({ stageId });

    forkJoin({
      stage: this.service.getStageDetail(stageId),
      visites: this.service.getVisites(stageId),
      bilanMiStage: this.service.getBilanMiStage(stageId),
      bilanFinStage: this.service.getBilanFinStage(stageId),
      evaluationMaitreStage: this.service.getEvaluationMaitreStage(stageId),
    }).subscribe({
      next: (res) => {
        this.stage.set(res.stage);
        this.bilanMiStage.set(res.bilanMiStage);
        this.bilanFinStage.set(res.bilanFinStage);
        this.evaluationMaitreStage.set(res.evaluationMaitreStage);

        const visites: any[] = Array.isArray(res.visites) ? res.visites : [];

        this.patchVisite(this.form1, visites.find((v) => v.numeroEntrevue === 1));
        this.patchVisite(this.form2, visites.find((v) => v.numeroEntrevue === 2));
        this.patchVisite(this.form3, visites.find((v) => v.numeroEntrevue === 3));

        if (visites.some((v) => v.numeroEntrevue === 3)) {
          this.visibleInterviewCount.set(3);
        } else if (visites.some((v) => v.numeroEntrevue === 2)) {
          this.visibleInterviewCount.set(2);
        } else {
          this.visibleInterviewCount.set(1);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger la fiche superviseur.');
        this.isLoading.set(false);
      },
    });
  }

  visibleInterviewForms = computed(() => {
    const forms = [
      { numero: 1, form: this.form1 },
      { numero: 2, form: this.form2 },
      { numero: 3, form: this.form3 },
    ];

    return forms.slice(0, this.visibleInterviewCount());
  });

  canAddInterview(): boolean {
    return this.visibleInterviewCount() < 3;
  }

  addInterview(): void {
    if (this.visibleInterviewCount() < 3) {
      this.visibleInterviewCount.update((count) => count + 1);
    }
  }

  saveInterview(numero: number): void {
    const form =
      numero === 1 ? this.form1 :
        numero === 2 ? this.form2 :
          this.form3;

    this.saveForm(form);
  }

  getInterviewStatusLabel(form: FormGroup): string {
    const value = form.getRawValue();

    const hasContent = Object.values(value).some((v) => v !== null && v !== '');
    if (!hasContent) return 'À remplir';

    return form.dirty ? 'Modifications en cours' : 'Entrevue enregistrée ou commencée';
  }

  stageStatusUi = computed(() => getStageEtatUi(this.stage()?.etat));

  private createEntrevueForm(numeroEntrevue: number) {
    return this.fb.group({
      stageId: [0, Validators.required],
      numeroEntrevue: [numeroEntrevue, Validators.required],

      dateEntrevueMaitre: [''],
      dureeEntrevueMaitreMinutes: [null],
      typeEntrevueMaitre: [''],
      personneRencontreeEntreprise: [''],
      commentairesEtablissementMaitre: [''],
      commentairesDeroulementStageMaitre: [''],

      dateEntrevueStagiaire: [''],
      dureeEntrevueStagiaireMinutes: [null],
      typeEntrevueStagiaire: [''],
      commentairesEtablissementStagiaire: [''],
      commentairesDeroulementStageStagiaire: [''],

      commentaireGeneral: [''],
    });
  }

  private patchVisite(form: any, visite: any) {
    if (!visite) return;

    form.patchValue({
      stageId: this.stageId(),
      numeroEntrevue: visite.numeroEntrevue,
      dateEntrevueMaitre: visite.dateEntrevueMaitre
        ? visite.dateEntrevueMaitre.split('T')[0]
        : '',
      dureeEntrevueMaitreMinutes: visite.dureeEntrevueMaitreMinutes,
      typeEntrevueMaitre: visite.typeEntrevueMaitre ?? '',
      personneRencontreeEntreprise: visite.personneRencontreeEntreprise ?? '',
      commentairesEtablissementMaitre: visite.commentairesEtablissementMaitre ?? '',
      commentairesDeroulementStageMaitre:
        visite.commentairesDeroulementStageMaitre ?? '',

      dateEntrevueStagiaire: visite.dateEntrevueStagiaire
        ? visite.dateEntrevueStagiaire.split('T')[0]
        : '',
      dureeEntrevueStagiaireMinutes: visite.dureeEntrevueStagiaireMinutes,
      typeEntrevueStagiaire: visite.typeEntrevueStagiaire ?? '',
      commentairesEtablissementStagiaire:
        visite.commentairesEtablissementStagiaire ?? '',
      commentairesDeroulementStageStagiaire:
        visite.commentairesDeroulementStageStagiaire ?? '',

      commentaireGeneral: visite.commentaireGeneral ?? '',
    });
  }

  saveForm(form: any) {
    this.successMessage.set('');
    this.errorMessage.set('');

    form.patchValue({
      stageId: this.stageId(),
    });

    this.service.saveVisite(form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set(
          `Entrevue ${form.get('numeroEntrevue')?.value} enregistrée.`,
        );
      },
      error: () => {
        this.errorMessage.set(
          `Impossible d'enregistrer l'entrevue ${form.get('numeroEntrevue')?.value}.`,
        );
      },
    });
  }

  getTypeEntrevueLabel(value: string | null | undefined): string {
    switch (value) {
      case 'PRESENTIEL':
        return 'Présentiel';
      case 'VISIOCONFERENCE':
        return 'Visioconférence';
      case 'TELEPHONE':
        return 'Téléphone';
      default:
        return '-';
    }
  }

  getOuiNon(value: boolean | null | undefined): string {
    if (value === true) return 'Oui';
    if (value === false) return 'Non';
    return '-';
  }

  getContactEntrepriseAffiche(): any | null {
    const stage = this.stage();
    return stage?.maitreStage ?? stage?.contactStage ?? null;
  }

  getContactEntrepriseType(): string {
    return this.stage()?.maitreStage ? 'Maître de stage' : 'Contact de stage';
  }

  getAdresseEntrepriseComplete(): string {
    const entreprise = this.stage()?.entreprise;
    if (!entreprise) return '-';

    const ligne1 = [entreprise.numeroRue, entreprise.nomRue].filter(Boolean).join(' ');
    const ligne2 = entreprise.adresseLigne2;
    const ligne3 = [entreprise.ville, entreprise.province, entreprise.codePostal]
      .filter(Boolean)
      .join(', ');

    return [ligne1, ligne2, ligne3].filter(Boolean).join(' • ') || '-';
  }

  getTrancheHoraire(): string {
    const stage = this.stage();
    if (!stage) return '-';

    if (stage.heureDebut && stage.heureFin) return `${stage.heureDebut} à ${stage.heureFin}`;
    if (stage.heureDebut) return `Début : ${stage.heureDebut}`;
    if (stage.heureFin) return `Fin : ${stage.heureFin}`;
    return '-';
  }

  downloadPdf(url: string, filename: string): void {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      });
  }

  downloadBilanMiStagePdf(): void {
    this.downloadPdf(
      `${location.origin.replace(':4200', ':3000')}/pdf/bilan-mi-stage/${this.stageId()}`,
      `bilan-mi-stage-${this.stageId()}.pdf`,
    );
  }

  downloadBilanFinStagePdf(): void {
    this.downloadPdf(
      `${location.origin.replace(':4200', ':3000')}/pdf/bilan-fin-stage/${this.stageId()}`,
      `bilan-fin-stage-${this.stageId()}.pdf`,
    );
  }

  downloadEvaluationMaitreStagePdf(): void {
    this.downloadPdf(
      `${location.origin.replace(':4200', ':3000')}/pdf/evaluation-maitre-stage/${this.stageId()}`,
      `evaluation-maitre-stage-${this.stageId()}.pdf`,
    );
  }

  downloadVisiteSuperviseurPdf(): void {
    this.downloadPdf(
      `${location.origin.replace(':4200', ':3000')}/pdf/visite-superviseur/${this.stageId()}`,
      `visite-superviseur-${this.stageId()}.pdf`,
    );
  }

  isVisiteComplete(): boolean {
    const forms = [this.form1, this.form2, this.form3];
    return forms.some((form) => {
      const value = form.getRawValue();
      return !!(
        value.dateEntrevueMaitre ||
        value.dateEntrevueStagiaire ||
        value.commentaireGeneral ||
        value.commentairesDeroulementStageMaitre ||
        value.commentairesDeroulementStageStagiaire
      );
    });
  }
}