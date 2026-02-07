import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUserValue;
  
  if (currentUser) {
    // Kiểm tra role nếu route yêu cầu
    if (route.data['roles']) {
      const roles = route.data['roles'] as string[];
      if (!authService.hasRole(roles)) {
        router.navigate(['/']);
        return false;
      }
    }
    return true;
  }

  // Chưa đăng nhập, chuyển về trang login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
