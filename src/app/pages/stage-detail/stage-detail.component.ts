import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { PdfService } from '../../core/services/pdf/pdf.service';

@Component({
  selector: 'app-stage-detail',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './stage-detail.component.html',
})
export class StageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private stagesService = inject(StagesService);
  private pdfService = inject(PdfService);

  data = signal<any | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor() {
  this.route.paramMap.subscribe((params) => {
    const stageId = Number(params.get('id'));

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
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le détail du stage.');
        this.isLoading.set(false);
      },
    });
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
}