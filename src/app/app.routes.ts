import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/maininterface/dashboard/dashboard.component';
import { WorkoutsComponent } from './pages/maininterface/workouts/workouts.component';
import { GoalsComponent } from './pages/maininterface/goals/goals.component';
import { MainInterfaceComponent } from './components/layout/main-interface/main-interface.component';
import { authGuardFn } from './guards/auth.guard';
import { SettingsComponent } from './pages/maininterface/settings/settings.component';
import { AuthLayoutComponent } from './components/layout/auth-layout/auth-layout.component';
import { LoadingComponent } from './components/loading/loading.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'TrackFit | Login',
      },
      {
        path: 'sign-up',
        component: SignupComponent,
        title: 'TrackFit | Sign Up',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'TrackFit | Forgot Password',
      },
    ],
  },
  {
    path: '',
    component: MainInterfaceComponent,
    canActivate: [authGuardFn],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
        title: 'TrackFit',
      },
      {
        path: 'workouts',
        component: WorkoutsComponent,
        title: 'TrackFit | Workouts',
      },
      {
        path: 'goals',
        component: GoalsComponent,
        title: 'TrackFit | Goals',
      },
      {
        path: 'settings',
        component: SettingsComponent,
        title: 'TrackFit | Settings',
      },
    ],
  },
  {
    path: 'loading',
    component: LoadingComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
