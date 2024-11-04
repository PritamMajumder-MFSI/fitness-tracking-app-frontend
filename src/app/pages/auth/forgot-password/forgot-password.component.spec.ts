import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { ToastService } from '../../../services/toast.service';
import { BackendService } from '../../../services/backend.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  let mockBackendService: jasmine.SpyObj<BackendService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', [
      'postApiCall',
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', ['add']);
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
        {
          provide: ToastService,
          useValue: mockToastService,
        },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize otpForm and resetPasswordForm', () => {
    expect(component.otpForm).toBeDefined();
    expect(component.resetPasswordForm).toBeDefined();
  });

  it('should call sendOtp when a valid email is provided', async () => {
    component.otpForm.controls['email'].setValue('test@example.com');
    mockBackendService.postApiCall.and.returnValue(
      of({ success: true, data: {}, message: 'Successfully sent otp' })
    );

    await component.sendOtp();

    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      'auth/forgot-password',
      {
        email: 'test@example.com',
      }
    );
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Successfully sent OTP to email',
      3000,
      'success'
    );
    expect(component.otpSent).toBeTrue();
  });

  it('should show error message for invalid email', async () => {
    component.otpForm.controls['email'].setValue('invalid-email');

    await component.sendOtp();

    expect(mockToastService.add).toHaveBeenCalledWith(
      'Please enter a valid email',
      3000,
      'error'
    );
    expect(component.otpSent).toBeFalse();
  });

  it('should validate otp and newPassword in resetPasswordForm', () => {
    component.resetPasswordForm.controls['otp'].setValue('');
    component.resetPasswordForm.controls['newPassword'].setValue('short');

    expect(component.resetPasswordForm.valid).toBeFalse();

    component.resetPasswordForm.controls['otp'].setValue('123456');
    component.resetPasswordForm.controls['newPassword'].setValue(
      'NewPassword123'
    );

    expect(component.resetPasswordForm.valid).toBeTrue();
  });

  it('should call changePassword when OTP and new password are valid', async () => {
    component.otpSent = true;
    component.otpForm.controls['email'].setValue('test@example.com');
    component.resetPasswordForm.controls['otp'].setValue('123456');
    component.resetPasswordForm.controls['newPassword'].setValue(
      'NewPassword123'
    );
    mockBackendService.postApiCall.and.returnValue(
      of({ success: true, message: 'Succesfully changed password', data: {} })
    );

    await component.changePassword();

    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      'auth/forgot-password/reset-password',
      {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'NewPassword123',
      }
    );
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Password reset successfully',
      3000,
      'success'
    );
  });

  it('should show error if changePassword fails', async () => {
    component.otpSent = true;
    component.otpForm.controls['email'].setValue('test@example.com');
    component.resetPasswordForm.controls['otp'].setValue('123456');
    component.resetPasswordForm.controls['newPassword'].setValue(
      'NewPassword123'
    );
    mockBackendService.postApiCall.and.returnValue(
      throwError(() => new Error('Failed to reset password'))
    );

    await component.changePassword();

    expect(mockToastService.add).toHaveBeenCalledWith(
      'Failed to reset password',
      3000,
      'error'
    );
  });
});
