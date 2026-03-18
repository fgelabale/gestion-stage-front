import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminManquantsComponent } from './pages/admin-manquants/admin-manquants.component';
import { StageDetailComponent } from './pages/stage-detail/stage-detail.component';
import { MaitreStageAccessComponent } from './pages/maitre-stage-access/maitre-stage-access.component';
import { StagiaireDashboardComponent } from './pages/stagiaire-dashboard-component/stagiaire-dashboard-component';
import { StagiaireStageDetailComponent } from './pages/stagiaire-stage-detail-component/stagiaire-stage-detail-component';
import { StagiaireRapportFormComponent } from './pages/stagiaire-rapport-form/stagiaire-rapport-form';
import { StagiaireBilanMiStageComponent } from './pages/stagiaire-bilan-mi-stage-form/stagiaire-bilan-mi-stage-form';
import { StagiaireBilanFinStageComponent } from './pages/stagiaire-bilan-fin-stage/stagiaire-bilan-fin-stage';
import { roleGuard } from './core/guards/role-guard';
import { loginRedirectGuard } from './core/guards/login-redirect-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginRedirectGuard] },
  {
    path: 'admin/manquants',
    component: AdminManquantsComponent,
    canActivate: [roleGuard('ADMIN', 'SUPERVISEUR')],
  },
  {
    path: 'admin/stages/:id',
    component: StageDetailComponent,
    canActivate: [roleGuard('ADMIN', 'SUPERVISEUR')],
  },

  {
    path: 'stagiaire',
    component: StagiaireDashboardComponent,
    canActivate: [roleGuard('ETUDIANT')],
  },
  {
    path: 'stagiaire/stages/:id',
    component: StagiaireStageDetailComponent,
    canActivate: [roleGuard('ETUDIANT')],
  },
  {
    path: 'stagiaire/stages/:id/rapport/:semaine',
    component: StagiaireRapportFormComponent,
    canActivate: [roleGuard('ETUDIANT')],
  },
  {
    path: 'stagiaire/stages/:id/bilan-mi-stage',
    component: StagiaireBilanMiStageComponent,
    canActivate: [roleGuard('ETUDIANT')],
  },
  {
    path: 'stagiaire/stages/:id/bilan-fin-stage',
    component: StagiaireBilanFinStageComponent,
    canActivate: [roleGuard('ETUDIANT')],
  },

  {
    path: 'maitre-stage/acces/:token',
    component: MaitreStageAccessComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];