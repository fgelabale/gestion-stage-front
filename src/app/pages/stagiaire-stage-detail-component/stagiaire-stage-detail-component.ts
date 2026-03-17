import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';

@Component({
  selector: 'app-stagiaire-stage-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule],
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
}