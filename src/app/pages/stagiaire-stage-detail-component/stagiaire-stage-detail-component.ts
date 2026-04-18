import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-stagiaire-stage-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './stagiaire-stage-detail-component.html',
  styleUrl: './stagiaire-stage-detail-component.css',

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
  getDisplayedResponsable(stage: any) {
    const maitre = stage?.maitreStage;
    const contact = stage?.contactStage;

    const hasMaitre =
      !!maitre?.prenom?.trim() ||
      !!maitre?.nom?.trim() ||
      !!maitre?.courriel?.trim() ||
      !!maitre?.telephone?.trim();

    return hasMaitre ? maitre : contact;
  }

  hasRealMaitreStage(stage: any): boolean {
    const maitre = stage?.maitreStage;

    return !!(
      maitre?.prenom?.trim() ||
      maitre?.nom?.trim() ||
      maitre?.courriel?.trim() ||
      maitre?.telephone?.trim()
    );
  }

  getDisplayedResponsableLabel(stage: any): string {
    return this.hasRealMaitreStage(stage)
      ? 'Maître de stage'
      : 'Contact de stage';
  }
}