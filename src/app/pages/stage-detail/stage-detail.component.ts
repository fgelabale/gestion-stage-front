import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { PdfService } from '../../core/services/pdf/pdf.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-stage-detail',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatCardModule],
  templateUrl: './stage-detail.component.html',
})
export class StageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private stagesService = inject(StagesService);
  private pdfService = inject(PdfService);
  private fb = inject(FormBuilder);

  etatOptions = ['EN_COURS', 'PRE_VALIDE', 'ENTENTE_RECUE', 'ACCEPTE', 'CLOTURE'];

  etatForm = this.fb.nonNullable.group({
    etat: ['EN_COURS', Validators.required],
  });

  isSavingEtat = signal(false);
  successEtatMessage = signal('');

  data = signal<any | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const stageId = Number(params.get('id'));
      this.loadStage(stageId);
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
}