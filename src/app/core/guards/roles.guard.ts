import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../services/auth-api/auth.store';

export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return async (): Promise<boolean | UrlTree> => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    await authStore.ensureLoaded();

    if (!authStore.isLogged()) {
      return router.createUrlTree(['/login']);
    }

    if (authStore.hasRole(...allowedRoles)) {
      return true;
    }

    return router.createUrlTree([authStore.getDefaultRouteByRole()]);
  };
}