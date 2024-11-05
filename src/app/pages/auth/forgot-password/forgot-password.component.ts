import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../components/layout/auth-layout/auth-layout.component';
import getErrorMessage from '../../../../utils/getErrorMessage';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    AuthLayoutComponent,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public otpSent = false;
  public otpForm: FormGroup;
  public resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private backendService: BackendService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {
    this.otpForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });

    this.resetPasswordForm = this.fb.group({
      otp: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9]{8,30}$/),
          Validators.required,
        ],
      ],
    });
  }

  public getErrorMessage: (
    controlName: string,
    form: FormGroup
  ) => string | null = getErrorMessage;

  async forgotPassword() {
    if (this.otpSent) {
      this.changePassword();
    } else {
      this.sendOtp();
    }
  }

  async sendOtp() {
    try {
      if (!this.otpForm.valid) {
        this.toastService.add('Please enter a valid email', 3000, 'error');
        return;
      }
      const res = await lastValueFrom(
        this.backendService.postApiCall('auth/forgot-password', {
          email: this.otpForm.value.email,
        })
      );
      if (res.success) {
        this.toastService.add(
          'Successfully sent OTP to email',
          3000,
          'success'
        );
        this.otpSent = true;
        this.cd.detectChanges();
      } else {
        this.toastService.add(
          res.message ? res.message : 'Failed to send email',
          3000,
          'error'
        );
      }
    } catch (err) {
      this.toastService.add(
        err instanceof Error ? err.message : 'Failed to send email',
        3000,
        'error'
      );
    }
  }

  async changePassword() {
    if (!this.resetPasswordForm.valid) {
      this.toastService.add('Please fill in all fields', 3000, 'error');
      return;
    }

    try {
      const res = await lastValueFrom(
        this.backendService.postApiCall('auth/forgot-password/reset-password', {
          email: this.otpForm.value.email,
          ...this.resetPasswordForm.value,
        })
      );

      if (res.success) {
        this.toastService.add('Password reset successfully', 3000, 'success');
        this.router.navigate(['/auth/login']);
      } else {
        this.toastService.add(
          res.message || 'Failed to reset password',
          3000,
          'error'
        );
      }
    } catch (err) {
      this.toastService.add(
        err instanceof Error ? err.message : 'Failed to reset password',
        3000,
        'error'
      );
    }
  }
}
