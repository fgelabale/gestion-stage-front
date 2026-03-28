import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthStore } from '../../core/services/auth-api/auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService); // FRONT
  private readonly authStore = inject(AuthStore);     // FRONT
  private readonly router = inject(Router);

  errorMessage = '';
  isLoading = false;

  form = this.fb.nonNullable.group({
    courrielEcole: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });

  constructor() {
    if (this.authStore.isLogged()) {
      this.router.navigate([this.authStore.getDefaultRouteByRole()]);
    }
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    localStorage.removeItem('token');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: async () => {
        await this.authStore.chargerUtilisateur();
        this.isLoading = false;
        this.router.navigate([this.authStore.getDefaultRouteByRole()]);
      },
      error: (error) => {
        this.isLoading = false;

        if (error?.status === 401) {
          this.errorMessage = 'Identifiants invalides.';
          return;
        }

        this.errorMessage = 'Une erreur est survenue. Réessaie.';
      },
    });
  }
}