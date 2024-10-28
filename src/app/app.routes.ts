import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/maininterface/dashboard/dashboard.component';
import { WorkoutsComponent } from './pages/maininterface/workouts/workouts.component';
import { GoalsComponent } from './pages/maininterface/goals/goals.component';
import { MainInterfaceComponent } from './components/layout/main-interface/main-interface.component';

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
    component: MainInterfaceComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
      },
      {
        path: 'workouts',
        component: WorkoutsComponent,
      },
      {
        path: 'goals',
        component: GoalsComponent,
      },
    ],
  },

  {
    path: '*',
    component: NotFoundComponent,
  },
];
