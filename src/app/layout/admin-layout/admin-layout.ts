import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth/auth.service';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AppHeaderComponent, MatButtonModule],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.getCurrentUser();

  get isReadOnlyAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN_READER';
  }
}