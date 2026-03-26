import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}