import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EntreprisesService } from '../../core/services/entreprises/entreprises';
@Component({
  selector: 'app-admin-entreprise-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-entreprise-edit.html',
})
export class AdminEntrepriseEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private entreprisesService = inject(EntreprisesService);

  entrepriseId!: number;

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    numeroRue: [''],
    nomRue: [''],
    ville: [''],
    province: [''],
    codePostal: ['', [Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)]],
    telephone: [''],
  });

  ngOnInit(): void {
    this.entrepriseId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.entreprisesService.findOne(this.entrepriseId).subscribe({
      next: (entreprise) => {
        this.form.patchValue({
          nom: entreprise.nom ?? '',
          numeroRue: entreprise.numeroRue ?? '',
          nomRue: entreprise.nomRue ?? '',
          ville: entreprise.ville ?? '',
          province: entreprise.province ?? '',
          codePostal: entreprise.codePostal ?? '',
          telephone: entreprise.telephone ?? '',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Impossible de charger l’entreprise.');
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

    this.entreprisesService.update(this.entrepriseId, this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Entreprise mise à jour avec succès.');
        this.isSaving.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Impossible de mettre à jour l’entreprise.');
        this.isSaving.set(false);
      },
    });
  }
}