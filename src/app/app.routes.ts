import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        component: SignupComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: '*',
    component: NotFoundComponent,
  },
];
