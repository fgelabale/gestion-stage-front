import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StagesService } from '../../core/services/stage/stages.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
 
@Component({
  selector: 'app-admin-manquants',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule],
  templateUrl: './admin-manquants.component.html',
})
export class AdminManquantsComponent implements OnInit {
  private stagesService = inject(StagesService);

  displayedColumns = [
    'etudiant',
    'groupe',
    'entreprise',
    'semainesManquantes',
    'bilanMiStage',
    'bilanFinStage',
    'evaluationMaitreStage',
    'statut',
    'actions',
  ];

  stages = signal<any[]>([]);

  ngOnInit(): void {
    this.stagesService.getStagesManquants().subscribe({
      next: (response: any) => {
        this.stages.set(response.stages ?? []);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}