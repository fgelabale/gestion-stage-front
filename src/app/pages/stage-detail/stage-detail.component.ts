import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StagesService } from '../../core/services/stage/stages.service';
import { PdfService } from '../../core/services/pdf/pdf.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stage-detail',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './stage-detail.component.html',
})
export class StageDetailComponent implements OnInit {
  data: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stagesService: StagesService,
    private readonly pdfService: PdfService,
  ) {}

  ngOnInit(): void {
    const stageId = Number(this.route.snapshot.paramMap.get('id'));

    this.stagesService.getStageDetail(stageId).subscribe((response) => {
      this.data = response;
    });
  }

  downloadPdf(): void {
    if (this.data?.stage?.id) {
      this.pdfService.downloadStagePdf(this.data.stage.id);
    }
  }
}