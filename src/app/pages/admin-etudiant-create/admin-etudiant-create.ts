import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../core/services/users/users';
import { GroupesService } from '../../core/services/groupes/groupes';

@Component({
  selector: 'app-admin-etudiant-create',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './admin-etudiant-create.html',
})
export class AdminEtudiantCreateComponent {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private groupesService = inject(GroupesService);
  private router = inject(Router);

  groupes = signal<any[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.nonNullable.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
    groupeId: [null as number | null],
  });

  constructor() {
    this.loadGroupes();
  }

  loadGroupes(): void {
    this.groupesService.getGroupes().subscribe({
      next: (response: any) => {
        this.groupes.set(response ?? []);
        this.isLoading.set(false);
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

    const payload = {
      ...this.form.getRawValue(),
      role: 'ETUDIANT',
    };

    this.usersService.createUser(payload).subscribe({
      next: () => {
        this.successMessage.set('Étudiant ajouté avec succès.');
        this.isSaving.set(false);
        this.form.reset({
          prenom: '',
          nom: '',
          email: '',
          motDePasse: '',
          groupeId: null,
        });
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || "Impossible d'ajouter l'étudiant.",
        );
        this.isSaving.set(false);
      },
    });
  }

  goToEtudiants(): void {
    this.router.navigate(['/admin/etudiants']);
  }
}