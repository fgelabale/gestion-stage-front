import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../core/services/auth-api/auth.store';

@Component({
  selector: 'app-stagiaire-layout',
  standalone: true,
  templateUrl: './stagiaire-layout.html',
  styleUrl: './stagiaire-layout.css',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule
  ],
})
export class StagiaireLayoutComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  // 🔥 IMPORTANT
  currentUser = this.authStore.utilisateur;

  logout(): void {
    localStorage.removeItem('token');
    this.authStore.logoutLocalState();
    this.router.navigate(['/login']);
  }
}