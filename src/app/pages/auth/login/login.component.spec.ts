import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BackendService } from '../../../services/backend.service';
import { ToastService } from '../../../services/toast.service';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from '../../../app.routes';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const mockBackendService = jasmine.createSpyObj('BackendService', [
      'postApiCall',
    ]);
    const mockToastService = jasmine.createSpyObj('ToastService', ['add']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should redirect on googleSignIn', () => {
    // component.googleSignIn();
    // expect(window.location.href).toBe(
    //   'http://localhost:3000/api/v1/auth/googleAuth?action=SIGN_IN'
    // );
  });
});
