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
    path: 'meeting-management', 
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
        loadComponent: () => import('./pages/meeting-calendar/meeting-calendar.component').then(m => m.MeetingCalendarComponent),
        data: { roles: ['admin'] }
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/room-management/room-management.component').then(m => m.RoomManagementComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./pages/meeting-schedule/meeting-schedule.component').then(m => m.MeetingScheduleComponent),
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: 'bookings-new',
        loadComponent: () => import('./pages/meeting-schedule/meeting-form/meeting-form.component').then(m => m.MeetingFormComponent),
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: 'plan-management',
        loadComponent: () => import('./pages/plan-management/plan-management.component').then(m => m.PlanManagementComponent),
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/employee-management/employee-management.component').then(m => m.EmployeeManagementComponent),
        data: { roles: ['admin'] }
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
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
