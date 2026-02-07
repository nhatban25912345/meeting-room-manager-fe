import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'onboarding',
        pathMatch: 'full'
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
        data: { roles: ['admin'] }
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
        data: { roles: ['admin'] }
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
        data: { roles: ['admin'] }
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
