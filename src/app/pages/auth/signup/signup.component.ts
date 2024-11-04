import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../components/layout/auth-layout/auth-layout.component';
import { lastValueFrom } from 'rxjs';
import { BackendService } from '../../../services/backend.service';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import getErrorMessage from '../../../../utils/getErrorMessage';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  public signUpForm: FormGroup;
  public getErrorMessage: (
    controlName: string,
    form: FormGroup
  ) => string | null = getErrorMessage;
  constructor(
    private _fb: FormBuilder,
    private _backendService: BackendService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.signUpForm = this._fb.group(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9]+$/),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9]{8,30}$/),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordsMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  public async login() {
    if (this.signUpForm.invalid) {
      this.toastService.add(
        'Please correct the errors in the form',
        3000,
        'error'
      );
      return;
    }

    const payload = { ...this.signUpForm.value };
    delete payload.confirmPassword;

    try {
      console.log(payload);
      const response = await lastValueFrom(
        this._backendService.postApiCall<
          { user: { email: string; username: string } },
          { username: string; password: string; email: string }
        >('auth/sign-up', payload)
      );
      console.log('signup->', response);
      this.toastService.add('Account creation successful', 3000, 'success');
      this.router.navigate(['/auth/login']);
      console.log(response);
    } catch (err) {
      this.toastService.add(
        err instanceof Error ? err.message : 'Signup failed',
        3000,
        'error'
      );
    }
  }
}
