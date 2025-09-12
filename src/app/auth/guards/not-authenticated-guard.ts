import { CanMatchFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
