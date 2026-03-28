import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../services/auth-api/auth.store';

export const guestGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.ensureLoaded();

  if (!authStore.isLogged()) {
    return true;
  }

  return router.createUrlTree([authStore.getDefaultRouteByRole()]);
};