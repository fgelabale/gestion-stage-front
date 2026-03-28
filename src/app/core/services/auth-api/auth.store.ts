import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';

export type UtilisateurCourant = {
  id: number;
  courrielEcole: string;
  prenom: string;
  nom: string;
  telephone?: string | null;
  role: 'ADMIN' | 'ADMIN_READER' | 'SUPERVISEUR' | 'ETUDIANT';
  etudiant?: {
    id: number;
    groupeId: number;
    groupe: string | null;
  } | null;
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(AuthApiService);

  utilisateur = signal<UtilisateurCourant | null>(null);
  initialise = signal(false);

  async chargerUtilisateur(): Promise<void> {
    try {
      const user = await firstValueFrom(this.api.me());
      this.utilisateur.set(user);
    } catch {
      this.utilisateur.set(null);
    } finally {
      this.initialise.set(true);
    }
  }

  async ensureLoaded(): Promise<void> {
    if (this.initialise()) return;
    await this.chargerUtilisateur();
  }

  isLogged(): boolean {
    return !!this.utilisateur();
  }

  role(): UtilisateurCourant['role'] | undefined {
    return this.utilisateur()?.role;
  }

  getDefaultRouteByRole(): string {
    const role = this.role();

    if (role === 'ADMIN' || role === 'ADMIN_READER' || role === 'SUPERVISEUR') {
      return '/admin/manquants';
    }

    if (role === 'ETUDIANT') {
      return '/stagiaire';
    }

    return '/login';
  }

  hasRole(...allowedRoles: string[]): boolean {
    const role = this.role();
    return !!role && allowedRoles.includes(role);
  }

  logoutLocalState(): void {
    this.utilisateur.set(null);
    this.initialise.set(true);
  }
}