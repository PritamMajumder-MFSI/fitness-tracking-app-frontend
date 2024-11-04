import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { BackendService } from '../../../services/backend.service';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  const mockBackendService = jasmine.createSpyObj('BackendService', ['getApi']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, NoopAnimationsModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
