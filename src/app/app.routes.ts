import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './pages/login/login.component';
import { AdminManquantsComponent } from './pages/admin-manquants/admin-manquants.component';
import { StageDetailComponent } from './pages/stage-detail/stage-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/manquants',
    component: AdminManquantsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/stages/:id',
    component: StageDetailComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'admin/manquants', pathMatch: 'full' },
];