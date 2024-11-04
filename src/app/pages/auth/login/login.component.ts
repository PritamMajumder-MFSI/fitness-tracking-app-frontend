import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthLayoutComponent } from '../../../components/layout/auth-layout/auth-layout.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import getErrorMessage from '../../../../utils/getErrorMessage';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginFormGroup: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _backendService: BackendService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginFormGroup = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9]{8,30}$/),
      ]),
    });
  }

  public async login() {
    if (this.loginFormGroup.invalid) {
      return;
    }

    try {
      await lastValueFrom(
        this._backendService.postApiCall(
          '/auth/login',
          this.loginFormGroup.value
        )
      );
      this.router.navigate(['/']);
    } catch (err) {
      this.toastService.add(
        err instanceof Error ? err.message : 'Signup failed',
        3000,
        'error'
      );
    }
  }
  public getErrorMessage: (
    controlName: string,
    form: FormGroup
  ) => string | null = getErrorMessage;
  async googleSignIn() {
    window.location.assign(
      'http://localhost:3000/api/v1/auth/googleAuth?action=SIGN_IN'
    );
  }
}
