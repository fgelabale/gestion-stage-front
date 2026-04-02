import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StagesService } from '../../core/services/stage/stages.service';
import { AccesExterneService } from '../../core/services/accesExterne/acces-externe';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { getStageEtatUi, formatStatut } from '../../shared/helper/stage-etat.util';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoService } from '@jsverse/transloco';
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
    MatChipsModule,
    CommonModule,
    TranslocoPipe,
  ],
  templateUrl: './admin-manquants.component.html',
  styleUrl: './admin-manquants.component.css',
})
export class AdminManquantsComponent implements OnInit {
  private stagesService = inject(StagesService);
  private accesExterneService = inject(AccesExterneService);
  private transloco = inject(TranslocoService);
  private apiUrl = environment.apiUrl;
  successMessage = signal('');
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
    'etat',
    'actions',
  ];

  stages = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  groupeFilter = signal<string>('TOUS');
  texteFilter = signal<string>('');
  constructor(private http: HttpClient) { }

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
        row.superviseur?.prenom,
        row.superviseur?.nom,
        row.stage?.etat
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

  stagesEnCoursDeValidation = computed(() =>
    this.filteredStages().filter((row) => row.isStageEnCoursValidation),
  );

  stagesEchec = computed(() =>
    this.filteredStages().filter((row) => row.isStageEchec),
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

  getEtatUi(etat: string) {
    return getStageEtatUi(etat);
  }

  getEtatClass(etat: string | null | undefined): string {
    const map: Record<string, string> = {
      OUVERT: 'etat-ouvert',
      EN_TRAITEMENT: 'etat-traitement',
      ENTENTE_ENVOYEE: 'etat-entente-envoyee',
      ACCEPTE: 'etat-accepte',
      STAGE_ECHEC: 'etat-echec',
      ANNULE: 'etat-annule',
    };

    return map[etat ?? ''] ?? 'etat-default';
  }


  formatSemainesManquantes(semaines: number[]): string {
    return semaines?.length ? semaines.join(', ') : 'Aucune';
  }

  resume = computed(() => {
    const rows = this.filteredStages();

    return {
      total: rows.length,
      enCours: rows.filter((r) => r.isStageEnCours).length,
      enCoursDeValidation: rows.filter((r) => r.isStageEnCoursValidation).length,
      enEchec: rows.filter((r) => r.isStageEchec).length,
      termines: rows.filter((r) => r.isStageTermine).length,
      incomplets: rows.filter((r) => r.statutGlobal === 'INCOMPLET').length,
      miBilanEnRetard: rows.filter((r) => r.isMiBilanEnRetard).length,
      bilanFinalEnRetard: rows.filter((r) => r.isBilanFinalEnRetard).length,
    };
  });

  openPdf(stageId: number): void {
    //window.open(`${this.apiUrl}/pdf/stage/${stageId}`, '_blank');
    this.http
      .get(`${this.apiUrl}/pdf/stage/${stageId}`, {
        responseType: 'blob',
      })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stage-${stageId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  formatStatut(value: string): string {
    return formatStatut(value);
  }

  generateMaitreStageLink(row: any): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.stagesService.generateMaitreStageLink(row.stageId).subscribe({
      next: (response: any) => {
        const lien = response?.lien;
        if (lien) {
          navigator.clipboard.writeText(lien).then(() => {
            this.successMessage.set('Lien maître de stage généré et copié dans le presse-papiers.');
          }).catch(() => {
            this.successMessage.set(`Lien généré : ${lien}`);
          });
        } else {
          this.successMessage.set('Lien maître de stage généré.');
        }
      },
      error: (err) => {
        if (err?.status === 403) {
          this.errorMessage.set(
            "Le lien maître de stage ne peut être généré que pour un stage à l'état ACCEPTE.",
          );
          return;
        }

        this.errorMessage.set('Impossible de générer le lien maître de stage.');
      },
    });
  }
}