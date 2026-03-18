import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StagesService } from '../../core/services/stage/stages.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-manquants',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
  ],
  templateUrl: './admin-manquants.component.html',
})
export class AdminManquantsComponent implements OnInit {
  private stagesService = inject(StagesService);

  displayedColumns = [
    'etudiant',
    'groupe',
    'entreprise',
    'dateDebut',
    'dateFin',
    'semainesManquantes',
    'miBilan',
    'bilanFinal',
    'evaluationMaitreStage',
    'statut',
    'actions',
  ];

  stages = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  groupeFilter = signal<string>('TOUS');
  texteFilter = signal<string>('');

  groupes = computed(() => {
    const values = this.stages()
      .map((row) => row.groupe)
      .filter((groupe) => !!groupe);

    return ['TOUS', ...Array.from(new Set(values)).sort()];
  });

  filteredStages = computed(() => {
    const groupe = this.groupeFilter();
    const texte = this.texteFilter().trim().toLowerCase();

    return this.stages().filter((row) => {
      const matchGroupe = groupe === 'TOUS' || row.groupe === groupe;

      const searchable = [
        row.etudiant?.prenom,
        row.etudiant?.nom,
        row.groupe,
        row.entreprise,
        row.titre,
        row.superviseur?.prenom,
        row.superviseur?.nom,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchTexte = !texte || searchable.includes(texte);

      return matchGroupe && matchTexte;
    });
  });

  stagesEnCours = computed(() =>
    this.filteredStages().filter((row) => row.isStageEnCours),
  );

  stagesTermines = computed(() =>
    this.filteredStages().filter((row) => row.isStageTermine),
  );

  ngOnInit(): void {
    this.stagesService.getStagesManquants().subscribe({
      next: (response: any) => {
        this.stages.set(response?.stages ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les stages.');
        this.isLoading.set(false);
      },
    });
  }

  setGroupeFilter(value: string): void {
    this.groupeFilter.set(value);
  }

  setTexteFilter(value: string): void {
    this.texteFilter.set(value);
  }

  getBadgeStyle(value: 'COMPLET' | 'A_SURVEILLER' | 'EN_RETARD' | string): string {
    switch (value) {
      case 'COMPLET':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#e8f5e9;color:#2e7d32;font-weight:600;';
      case 'EN_RETARD':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#fff3e0;color:#ef6c00;font-weight:600;';
      case 'A_SURVEILLER':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#eceff1;color:#455a64;font-weight:600;';
      default:
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#eceff1;color:#455a64;font-weight:600;';
    }
  }

  getBilanFinalBadgeStyle(value: 'COMPLET' | 'A_SURVEILLER' | 'EN_RETARD' | string): string {
    switch (value) {
      case 'COMPLET':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#e8f5e9;color:#2e7d32;font-weight:600;';
      case 'EN_RETARD':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#ffebee;color:#c62828;font-weight:600;';
      case 'A_SURVEILLER':
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#eceff1;color:#455a64;font-weight:600;';
      default:
        return 'display:inline-block;padding:4px 10px;border-radius:999px;background:#eceff1;color:#455a64;font-weight:600;';
    }
  }

  formatSemainesManquantes(semaines: number[]): string {
    return semaines?.length ? semaines.join(', ') : 'Aucune';
  }
}