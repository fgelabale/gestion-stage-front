import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../core/services/users/users';
import { GroupesService } from '../../core/services/groupes/groupes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-etudiants',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './admin-etudiants.html',
})
export class AdminEtudiantsComponent {
  private usersService = inject(UsersService);
  private groupesService = inject(GroupesService);

  displayedColumns = ['nom', 'email', 'groupe', 'actions'];

  etudiants = signal<any[]>([]);
  groupes = signal<any[]>([]);

  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  texteFilter = signal('');

  filteredEtudiants = computed(() => {
    const texte = this.texteFilter().trim().toLowerCase();

    return this.etudiants().filter((etudiant) => {
      const searchable = [
        etudiant.prenom,
        etudiant.nom,
        etudiant.email,
        etudiant.groupe?.nom,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return !texte || searchable.includes(texte);
    });
  });

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.groupesService.getGroupes().subscribe({
      next: (groupes: any) => {
        this.groupes.set(groupes ?? []);

        this.usersService.getStudents().subscribe({
          next: (etudiants: any) => {
            const rows = (etudiants ?? []).map((e: any) => ({
              ...e,
              selectedGroupeId: e.groupeId ?? null,
              isSaving: false,
            }));

            this.etudiants.set(rows);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger les étudiants.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les groupes.');
        this.isLoading.set(false);
      },
    });
  }

  setTexteFilter(value: string): void {
    this.texteFilter.set(value);
  }

  setSelectedGroupe(rowId: number, groupeId: number | null): void {
    this.etudiants.update((rows) =>
      rows.map((row) =>
        row.id === rowId
          ? { ...row, selectedGroupeId: groupeId === null ? null : groupeId }
          : row,
      ),
    );
  }

  saveGroupe(row: any): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    this.etudiants.update((rows) =>
      rows.map((r) => (r.id === row.id ? { ...r, isSaving: true } : r)),
    );

    this.usersService
      .updateUserGroupe(row.id, row.selectedGroupeId)
      .subscribe({
        next: (updated: any) => {
          this.etudiants.update((rows) =>
            rows.map((r) =>
              r.id === row.id
                ? {
                  ...r,
                  groupeId: updated.groupeId,
                  groupe: updated.groupe,
                  selectedGroupeId: updated.groupeId ?? null,
                  isSaving: false,
                }
                : r,
            ),
          );

          this.successMessage.set('Groupe mis à jour.');
        },
        error: () => {
          this.etudiants.update((rows) =>
            rows.map((r) => (r.id === row.id ? { ...r, isSaving: false } : r)),
          );

          this.errorMessage.set("Impossible d'enregistrer le groupe.");
        },
      });
  }
}