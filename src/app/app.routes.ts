import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './pages/login/login.component';
import { AdminManquantsComponent } from './pages/admin-manquants/admin-manquants.component';
import { StageDetailComponent } from './pages/stage-detail/stage-detail.component';
import { MaitreStageAccessComponent } from './pages/maitre-stage-access/maitre-stage-access.component';
import { StagiaireDashboardComponent } from './pages/stagiaire-dashboard-component/stagiaire-dashboard-component';
import { StagiaireStageDetailComponent } from './pages/stagiaire-stage-detail-component/stagiaire-stage-detail-component';
import { StagiaireRapportFormComponent } from './pages/stagiaire-rapport-form/stagiaire-rapport-form';

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

  {
    path: 'stagiaire',
    component: StagiaireDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stagiaire/stages/:id',
    component: StagiaireStageDetailComponent,
    canActivate: [authGuard],
  },

  {
    path: 'maitre-stage/acces/:token',
    component: MaitreStageAccessComponent,
  },
  {
    path: 'stagiaire/stages/:id/rapport/:semaine',
    component: StagiaireRapportFormComponent,
    canActivate: [authGuard],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];