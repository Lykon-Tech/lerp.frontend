import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  return auth.validateToken().pipe(
    map(response => {
      if (response.valid) {
        if (state.url === '/' && auth.getCargo()?.permissao === 'OPERADOR FINANCEIRO') {
          router.navigate(['/pages/movimentos']);
          return false;
        }
        return true;
      } else {
        router.navigate(['/auth/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
