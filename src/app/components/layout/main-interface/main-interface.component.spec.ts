import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInterfaceComponent } from './main-interface.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { BackendService } from '../../../services/backend.service';

describe('MainInterfaceComponent', () => {
  let component: MainInterfaceComponent;
  let fixture: ComponentFixture<MainInterfaceComponent>;
  let router: Router;
  beforeEach(async () => {
    const mockBackendService = jasmine.createSpyObj('BackendService', [
      'getApi',
    ]);
    await TestBed.configureTestingModule({
      imports: [MainInterfaceComponent, NoopAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: BackendService, useValue: mockBackendService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainInterfaceComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return proper subtitle', () => {
    router.navigate(['/']).then(() => {
      const result = component.getTitleSubtitle();
      expect(result).toEqual({
        title: 'Welcome to TrackFit, test@example.com',
        subtitle:
          'This is your dashboard section, here you can preview all your statistics',
        route: '/',
      });
    });
  });
});
