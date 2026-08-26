import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth-guard';
import { guestGuard } from './core/auth/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import(
        './features/auth/login/login.component'
      ).then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import(
        './features/auth/register/register.component'
      ).then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'recovery',
    canActivate: [guestGuard],
    loadComponent: () =>
      import(
        './features/auth/recovery/recovery.component'
      ).then(
        (m) => m.RecoveryComponent,
      ),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './layout/app-shell/app-shell.component'
      ).then(
        (m) => m.AppShellComponent,
      ),

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import(
            './features/home/home.page'
          ).then(
            (m) => m.HomePage,
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import(
            './features/history/history.component'
          ).then(
            (m) => m.HistoryComponent,
          ),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import(
            './features/portfolio/portfolio.component'
          ).then(
            (m) => m.PortfolioComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/settings/settings.component'
          ).then(
            (m) => m.SettingsComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
  path: 'transactions/income',
  loadComponent: () =>
    import(
      './features/transactions/income-form/income-form.component'
    ).then(
      (m) => m.IncomeFormComponent,
    ),
},
{
  path: 'transactions/expense',
  loadComponent: () =>
    import(
      './features/transactions/expense-form/expense-form.component'
    ).then(
      (m) => m.ExpenseFormComponent,
    ),
},
    ],
  },

  {
  path: 'transactions/income/:id',
  loadComponent: () =>
    import(
      './features/transactions/income-form/income-form.component'
    ).then(
      (m) => m.IncomeFormComponent,
    ),
},
{
  path: 'transactions/expense/:id',
  loadComponent: () =>
    import(
      './features/transactions/expense-form/expense-form.component'
    ).then(
      (m) => m.ExpenseFormComponent,
    ),
},
  {
    path: '**',
    redirectTo: 'home',
  },
];