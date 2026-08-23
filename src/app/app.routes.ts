import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth-guard';
import { guestGuard } from './core/auth/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'recovery',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/recovery/recovery.component').then(
        (m) => m.RecoveryComponent,
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.page').then(
        (m) => m.HomePage,
      ),
  },
    {
  path: 'portfolio',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/portfolio/portfolio.component').then(
      (m) => m.PortfolioComponent,
    ),
},

{
  path: 'history',
  canActivate: [authGuard],
  loadComponent: () =>
    import(
      './features/history/history.component'
    ).then(
      (m) => m.HistoryComponent,
    ),
},
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  
  {
    path: '**',
    redirectTo: 'home',
  },

];