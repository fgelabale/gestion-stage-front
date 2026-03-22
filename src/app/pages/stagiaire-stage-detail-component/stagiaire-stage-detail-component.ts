import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { EtudiantsService } from '../../core/services/etudiants/etudiants.service';
@Component({
  selector: 'app-stagiaire-stage-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule],
  templateUrl: './stagiaire-stage-detail-component.html'
})
export class StagiaireStageDetailComponent {
  private route = inject(ActivatedRoute);
  private stagesService = inject(StagesService);

  data = signal<any | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const stageId = Number(params.get('id'));
      this.loadStage(stageId);
    });
  }

  loadStage(stageId: number): void {
    this.data.set(null);
    this.errorMessage.set('');

    if (!stageId || Number.isNaN(stageId)) {
      this.errorMessage.set('Identifiant de stage invalide.1');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    this.stagesService.getMonStageDetail(stageId).subscribe({
      next: (response) => {
        this.data.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger ce stage.');
        this.isLoading.set(false);
      },
    });
  }
  isWeekCompleted(stage: any, semaine: number): boolean {
    const semaines = (stage?.rapportsHebdomadaires ?? []).map(
      (r: any) => r.numeroSemaine,
    );
    return semaines.includes(semaine);
  }

  getBadgeStyle(isDone: boolean): string {
    return isDone
      ? 'display:inline-block;padding:4px 10px;border-radius:999px;background:#e8f5e9;color:#2e7d32;font-weight:600;'
      : 'display:inline-block;padding:4px 10px;border-radius:999px;background:#ffebee;color:#c62828;font-weight:600;';
  }

  private etudiantsService = inject(EtudiantsService);

  isAccepting = signal(false);
  acceptMessage = signal('');

  acceptStage(stageId: number): void {
    if (this.isAccepting()) return;

    this.isAccepting.set(true);
    this.errorMessage.set('');
    this.acceptMessage.set('');

    this.etudiantsService.acceptStage(stageId).subscribe({
      next: () => {
        this.acceptMessage.set('Stage accepté.');
        this.isAccepting.set(false);
        this.loadStage(stageId);
      },
      error: () => {
        this.errorMessage.set("Impossible d'accepter ce stage.");
        this.isAccepting.set(false);
      },
    });
  }
}