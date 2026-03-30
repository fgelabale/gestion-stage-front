import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../core/services/auth-api/auth.store';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class AdminLayoutComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private readonly msalService = inject(MsalService);
    private readonly authService = inject(AuthService);
  // 🔥 SIGNAL
  currentUser = this.authStore.utilisateur;

  // 🔥 CORRIGÉ
  get isReadOnlyAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN_READER';
  }

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