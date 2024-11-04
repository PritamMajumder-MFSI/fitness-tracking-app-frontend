import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { BackendService } from '../../../services/backend.service';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../../services/toast.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockBackendService = jasmine.createSpyObj('BackendService', ['getApi']);
  let router: Router;
  let mockToastService: jasmine.SpyObj<ToastService>;
  beforeEach(async () => {
    mockToastService = jasmine.createSpyObj('ToastService', ['add']);
    mockBackendService = jasmine.createSpyObj('BackendService', [
      'postApiCall',
    ]);
    await TestBed.configureTestingModule({
      imports: [SignupComponent, NoopAnimationsModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        {
          provide: ToastService,
          useValue: mockToastService,
        },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if form is invalid', () => {
    component.login();
    expect(mockBackendService.postApiCall).not.toHaveBeenCalled();
    expect(mockToastService.add).toHaveBeenCalled();
  });

  it('should handle signup if success', fakeAsync(() => {
    const mockVal = {
      email: 'prit@gmail.com',
      password: 'Pritam16',
      username: 'pritamm',
    };
    spyOn(router, 'navigate');

    component.signUpForm.setValue({ ...mockVal, confirmPassword: 'Pritam16' });
    mockBackendService.postApiCall.and.returnValue(
      of({ success: true, data: {}, message: 'Signup Successful' })
    );
    component.login();
    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      'auth/sign-up',
      mockVal
    );
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Account creation successful',
      3000,
      'success'
    );
  }));

  it('should handle if signup unsuccessful', fakeAsync(() => {
    const mockVal = {
      email: 'prit@gmail.com',
      password: 'Pritam16',
      username: 'pritamm',
    };
    spyOn(router, 'navigate');

    component.signUpForm.setValue({ ...mockVal, confirmPassword: 'Pritam16' });
    mockBackendService.postApiCall.and.returnValue(
      throwError(() => new Error('Signup unsuccessful'))
    );
    component.login();
    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      'auth/sign-up',
      mockVal
    );
    tick();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Signup unsuccessful',
      3000,
      'error'
    );
  }));
});
