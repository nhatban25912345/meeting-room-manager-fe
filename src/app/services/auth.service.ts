import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Permission {
  groupName: string;
  permissions: string[];
}

export interface User {
  userId: number;
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  unitCode: string;
  jobTitle: string;
  roleCode: string;
  permissions: Permission[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: {
    errorCode: string;
    errorMessage: string;
    statusCode: string;
    responseTime: string;
    displayMessage: string;
  };
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    fullName: string;
    username: string;
    phoneNumber: string;
    email: string;
    unitCode: string;
    jobTitle: string;
    roleCode: string;
    permissions: Permission[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      username,
      password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Device-Info': 'WebApp',
      'X-Forwarded-For': '127.0.0.1'
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      loginRequest,
      { headers }
    ).pipe(
      map(response => {
        if (response.status.statusCode === 'SUCCESS' && response.data) {
          // Lưu tokens
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('tokenType', response.data.tokenType);
          
          // Lưu thông tin user
          const user: User = {
            userId: 0, // API không trả về userId trong ví dụ, có thể decode từ token
            fullName: response.data.fullName,
            username: response.data.username,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            unitCode: response.data.unitCode,
            jobTitle: response.data.jobTitle,
            roleCode: response.data.roleCode,
            permissions: response.data.permissions
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token && !!this.currentUserValue;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.roleCode) : false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.permissions) return false;
    
    return user.permissions.some(group => 
      group.permissions.includes(permission)
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}
