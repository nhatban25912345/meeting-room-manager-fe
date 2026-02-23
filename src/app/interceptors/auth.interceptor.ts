import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Lấy token từ localStorage
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  
  // Clone request và thêm Authorization header nếu có token
  let authReq = req;
  if (token && !req.url.includes('/auth/login')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${tokenType} ${token}`,
        'Device-Info': 'WebApp',
        'X-Forwarded-For': '127.0.0.1'
      }
    });
  }
  
  // Xử lý response và lỗi
  return next(authReq).pipe(
    catchError((error) => {
      // Xử lý lỗi 401 - Unauthorized
      if (error.status === 401) {
        // Xóa token và redirect về trang login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('currentUser');
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
