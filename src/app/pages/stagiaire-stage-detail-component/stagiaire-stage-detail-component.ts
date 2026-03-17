import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { AppHeaderComponent } from '../../layout/app-header/app-header';

@Component({
  selector: 'app-stagiaire-stage-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, AppHeaderComponent],
  templateUrl: './stagiaire-stage-detail-component.html',
})
export class StagiaireStageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private stagesService = inject(StagesService);

  data = signal<any | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const stageId = Number(this.route.snapshot.paramMap.get('id'));

    if (!stageId || Number.isNaN(stageId)) {
      this.errorMessage.set('Identifiant de stage invalide.');
      this.isLoading.set(false);
      return;
    }

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
  getBadgeStyle(isDone: boolean): string {
    return isDone
      ? 'display:inline-block; padding:4px 10px; border-radius:999px; background:#e8f5e9; color:#2e7d32; font-weight:600;'
      : 'display:inline-block; padding:4px 10px; border-radius:999px; background:#ffebee; color:#c62828; font-weight:600;';
  }

  isWeekCompleted(stage: any, semaine: number): boolean {
    const semaines = (stage?.rapportsHebdomadaires ?? []).map(
      (r: any) => r.numeroSemaine,
    );
    return semaines.includes(semaine);
  }
}