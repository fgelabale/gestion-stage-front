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
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { StagiaireLayoutComponent } from './layout/stagiaire-layout/stagiaire-layout';
import { AdminEtudiantsComponent } from './pages/admin-etudiants/admin-etudiants';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginRedirectGuard],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard('ADMIN', 'SUPERVISEUR')],
    children: [
      {
        path: 'manquants',
        component: AdminManquantsComponent,
      },
      {
        path: 'stages/:id',
        component: StageDetailComponent,
      },
      {
        path: 'etudiants',
        component: AdminEtudiantsComponent,
      },
    ],
  },

  {
    path: 'stagiaire',
    component: StagiaireLayoutComponent,
    canActivate: [roleGuard('ETUDIANT')],
    children: [
      {
        path: '',
        component: StagiaireDashboardComponent,
      },
      {
        path: 'stages/:id',
        component: StagiaireStageDetailComponent,
      },
      {
        path: 'stages/:id/rapport/:semaine',
        component: StagiaireRapportFormComponent,
      },
      {
        path: 'stages/:id/bilan-mi-stage',
        component: StagiaireBilanMiStageComponent,
      },
      {
        path: 'stages/:id/bilan-fin-stage',
        component: StagiaireBilanFinStageComponent,
      },
    ],
  },

  {
    path: 'maitre-stage/acces/:token',
    component: MaitreStageAccessComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];