import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GroupesService } from '../../core/services/groupes/groupes';
import { UsersService } from '../../core/services/users/users';

@Component({
  selector: 'app-admin-affectation-superviseur',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './admin-affectation-superviseur.html',
})
export class AdminAffectationSuperviseurComponent {
  private fb = inject(FormBuilder);
  private groupesService = inject(GroupesService);
  private usersService = inject(UsersService);

  groupes = signal<any[]>([]);
  superviseurs = signal<any[]>([]);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.nonNullable.group({
    groupeId: [0, [Validators.required, Validators.min(1)]],
    superviseurId: [0, [Validators.required, Validators.min(1)]],
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
            this.isLoading.set(false);
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

  submit(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { groupeId, superviseurId } = this.form.getRawValue();

    this.usersService.assignSuperviseurToGroupe(groupeId, superviseurId).subscribe({
      next: (response: any) => {
        this.successMessage.set(
          `Affectation réussie. ${response.stagesMisAJour} stage(s) mis à jour.`,
        );
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set("Impossible d'affecter le superviseur au groupe.");
        this.isSaving.set(false);
      },
    });
  }
}