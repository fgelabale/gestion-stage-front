import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { environment } from '../../../environments/environment';

type StageTableRow = {
  id: number;
  nom: string;
  prenom: string;
  groupe: string;
  entreprise: string;
  codePostal: string;
};

@Component({
  selector: 'app-supervisor-manquants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './supervisor-manquants.component.html',
  styleUrl: './supervisor-manquants.component.css',
})
export class SupervisorManquantsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  displayedColumns: string[] = ['nom', 'prenom', 'groupe', 'entreprise', 'codePostal'];

  isLoading = signal(true);
  errorMessage = signal('');
  stages = signal<StageTableRow[]>([]);
  globalSearch = signal('');

  sortState = signal<Sort>({
    active: 'nom',
    direction: 'asc',
  });

  pageIndex = signal(0);
  pageSize = signal(10);
  pageSizeOptions = [5, 10, 20, 50];

  filteredStages = computed(() => {
    const search = this.normalize(this.globalSearch());
    const sort = this.sortState();

    let rows = this.stages().filter((row) => {
      if (!search) return true;

      return [
        row.nom,
        row.prenom,
        row.groupe,
        row.entreprise,
        row.codePostal,
      ]
        .map((v) => this.normalize(v))
        .some((v) => v.includes(search));
    });

    if (sort.active && sort.direction) {
      rows = [...rows].sort((a, b) => {
        const aValue = this.normalize(String(a[sort.active as keyof StageTableRow] ?? ''));
        const bValue = this.normalize(String(b[sort.active as keyof StageTableRow] ?? ''));

        const result = aValue.localeCompare(bValue, 'fr');
        return sort.direction === 'asc' ? result : -result;
      });
    }

    return rows;
  });

  pagedStages = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredStages().slice(start, end);
  });

  totalResults = computed(() => this.filteredStages().length);

  ngOnInit(): void {
    this.loadMesStages();
  }

  loadMesStages(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<{ stages: any[] }>(`${this.apiUrl}/superviseur/mes-stages`).subscribe({
      next: (response) => {
        const rows = (response?.stages ?? []).map((stage) => this.mapStageToRow(stage));
        this.stages.set(rows);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les stagiaires.');
        this.isLoading.set(false);
      },
    });
  }

  mapStageToRow(stage: any): StageTableRow {
    return {
      id: stage.id,
      nom: stage.etudiant?.user?.nom ?? '-',
      prenom: stage.etudiant?.user?.prenom ?? '-',
      groupe: stage.etudiant?.groupe?.nom ?? '-',
      entreprise: stage.entreprise?.nom ?? '-',
      codePostal: stage.entreprise?.codePostal ?? '-',
    };
  }

  setGlobalSearch(value: string): void {
    this.globalSearch.set(value);
    this.pageIndex.set(0);
  }

  sortData(sort: Sort): void {
    this.sortState.set(sort);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openStage(stageId: number): void {
    this.router.navigate(['/supervisor/stages', stageId]);
  }

  normalize(value: string | null | undefined): string {
    return (value ?? '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }
}