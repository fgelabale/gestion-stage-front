import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../core/services/auth-api/auth.store';

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

  // 🔥 SIGNAL
  currentUser = this.authStore.utilisateur;

  // 🔥 CORRIGÉ
  get isReadOnlyAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN_READER';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStore.logoutLocalState();
    this.router.navigate(['/login']);
  }
}