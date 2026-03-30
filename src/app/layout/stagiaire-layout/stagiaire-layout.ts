import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../core/services/auth-api/auth.store';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../../core/services/auth/auth.service';

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
  private authService = inject(AuthService);

  private router = inject(Router);
  private readonly msalService = inject(MsalService);
  // 🔥 IMPORTANT
  currentUser = this.authStore.utilisateur;

  logout(): void {
    // nettoyage local toujours
    this.authService.logout();
    this.authStore.logoutLocalState();

    const hasMicrosoftSession =
      this.msalService.instance.getAllAccounts().length > 0;

    if (hasMicrosoftSession) {
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: 'http://localhost:4200/login',
      });
      return;
    }

    this.router.navigateByUrl('/login');
  }
}