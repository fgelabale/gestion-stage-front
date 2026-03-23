import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../core/services/users/users';
import { GroupesService } from '../../core/services/groupes/groupes';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-admin-etudiants',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './admin-etudiants.html',
})
export class AdminEtudiantsComponent {
  private usersService = inject(UsersService);
  private groupesService = inject(GroupesService);

  displayedColumns = ['select', 'nom', 'email', 'groupe', 'actions'];

  etudiants = signal<any[]>([]);
  groupes = signal<any[]>([]);
  private fb = inject(FormBuilder);

  superviseurs = signal<any[]>([]);
  isAssigningSuperviseur = signal(false);

  assignForm = this.fb.nonNullable.group({
    superviseurId: [0, [Validators.required, Validators.min(1)]],
  });

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
        etudiant?.groupe?.nom,
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

        this.usersService.getSuperviseurs().subscribe({
          next: (superviseurs: any) => {
            this.superviseurs.set(superviseurs ?? []);

            this.usersService.getStudents().subscribe({
              next: (etudiants: any) => {
                const rows = (etudiants ?? []).map((e: any) => ({
                  ...e,
                  groupeId: e.groupeId ?? e.etudiant?.groupeId ?? null,
                  groupe: e.groupe ?? e.etudiant?.groupe ?? null,
                  selectedGroupeId: e.groupeId ?? e.etudiant?.groupeId ?? null,
                  selected: false,
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
            this.errorMessage.set('Impossible de charger les superviseurs.');
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
                  groupeId:
                    updated.groupeId ?? updated.etudiant?.groupeId ?? null,
                  groupe:
                    updated.groupe ?? updated.etudiant?.groupe ?? null,
                  selectedGroupeId:
                    updated.groupeId ?? updated.etudiant?.groupeId ?? null,
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

  toggleStudentSelection(rowId: number, checked: boolean): void {
    this.etudiants.update((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, selected: checked } : row,
      ),
    );
  }

  toggleAll(checked: boolean): void {
    this.etudiants.update((rows) =>
      rows.map((row) => ({ ...row, selected: checked })),
    );
  }

  selectedStudentCount = computed(
    () => this.filteredEtudiants().filter((e) => e.selected).length,
  );

  allFilteredSelected = computed(() => {
    const rows = this.filteredEtudiants();
    return rows.length > 0 && rows.every((r) => r.selected);
  });

  assignSuperviseurToSelection(): void {
  if (this.assignForm.invalid || this.isAssigningSuperviseur()) {
    this.assignForm.markAllAsTouched();
    return;
  }

  const selectedIds = this.etudiants()
    .filter((e) => e.selected)
    .map((e) => e.etudiantId ?? e.id)
    .filter(Boolean);

  if (!selectedIds.length) {
    this.errorMessage.set('Veuillez sélectionner au moins un étudiant.');
    return;
  }

  const superviseurId = this.assignForm.getRawValue().superviseurId;

  this.isAssigningSuperviseur.set(true);
  this.errorMessage.set('');
  this.successMessage.set('');

  this.usersService
    .assignSuperviseurToEtudiants(selectedIds, superviseurId)
    .subscribe({
      next: (response: any) => {
        this.successMessage.set(
          `Superviseur affecté. ${response.stagesMisAJour} stage(s) mis à jour.`,
        );
        this.isAssigningSuperviseur.set(false);

        this.etudiants.update((rows) =>
          rows.map((row) => ({ ...row, selected: false })),
        );
      },
      error: () => {
        this.errorMessage.set(
          "Impossible d'affecter le superviseur aux étudiants sélectionnés.",
        );
        this.isAssigningSuperviseur.set(false);
      },
    });
}
}