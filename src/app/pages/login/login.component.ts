import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
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
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  form = this.fb.nonNullable.group({
    courrielEcole: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });
  
  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getDefaultRouteByRole()]);
    }
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.authService.getDefaultRouteByRole()]);
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