import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Pas de token local
  if (!token) {
    return next(req);
  }

  // Ne touche pas aux requêtes déjà autorisées
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloned);
};