import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BackendService } from '../../../services/backend.service';
import { ToastService } from '../../../services/toast.service';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from '../../../app.routes';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockBackendService: jasmine.SpyObj<BackendService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let router: Router;
  let windowStub: Window & typeof globalThis;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', [
      'postApiCall',
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', ['add']);
    windowStub = {
      location: {
        assign(value: string) {
          return value;
        },
      },
    } as unknown as Window & typeof globalThis;
    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
        { provide: Window, useValue: windowStub },
        {
          provide: ToastService,
          useValue: mockToastService,
        },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
  });

  it('should handle login if success', fakeAsync(() => {
    const mockVal = {
      email: 'prit@gmail.com',
      password: 'Pritam16',
    };
    spyOn(router, 'navigate');

    component.loginFormGroup.setValue(mockVal);
    mockBackendService.postApiCall.and.returnValue(
      of({ success: true, data: {}, message: 'Login Successful' })
    );
    component.login();
    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      '/auth/login',
      mockVal
    );
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle if login unsuccessful', fakeAsync(() => {
    const mockVal = {
      email: 'prit@gmail.com',
      password: 'Pritam16',
    };
    spyOn(router, 'navigate');

    component.loginFormGroup.setValue(mockVal);
    mockBackendService.postApiCall.and.returnValue(
      throwError(() => new Error('Login unsuccessful'))
    );
    component.login();
    expect(mockBackendService.postApiCall).toHaveBeenCalledWith(
      '/auth/login',
      mockVal
    );
    tick();
    expect(router.navigate).not.toHaveBeenCalledWith(['/']);
    expect(mockToastService.add).toHaveBeenCalled();
  }));
  it('should redirect on googleSignIn', () => {
    // spyOn(windowStub.location, 'assign');
    // component.googleSignIn();
    // expect(windowStub.location.assign).toHaveBeenCalledWith(
    //   'http://localhost:3000/api/v1/auth/googleAuth?action=SIGN_IN'
    // );
  });
});
