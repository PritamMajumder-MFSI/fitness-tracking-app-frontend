import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { BackendService } from '../../services/backend.service';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: Router;
  let mockBackendService: jasmine.SpyObj<BackendService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['getApi']);
    mockToastService = jasmine.createSpyObj('BackendService', ['add']);
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
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

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeDrawerEvent when closing drawer', () => {
    spyOn(component.closeDrawerEvent, 'emit');
    component.closeDrawer();
    expect(component.closeDrawerEvent.emit).toHaveBeenCalledWith(true);
  });
  it('should return proper isActive', () => {
    router.navigate(['/']).then(() => {
      const val = component.isActive('/');
      expect(val).toBe(true);
    });
  });
  it('should return proper isActive when route mismatch', () => {
    router.navigate(['/']).then(() => {
      const val = component.isActive('/settings');
      expect(val).toBe(false);
    });
  });

  it('should handle logout properly', fakeAsync(() => {
    spyOn(router, 'navigate');
    mockBackendService.getApi.and.returnValue(
      of({ success: true, data: {}, message: 'Logout Successful' })
    );
    component.logout();
    expect(mockBackendService.getApi).toHaveBeenCalledWith('auth/logout');
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
  }));

  it('should handle unsuccessful logout properly', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.logout();
    mockBackendService.getApi.and.returnValue(
      throwError(() => new Error('Logout unsuccessful'))
    );
    expect(mockBackendService.getApi).toHaveBeenCalledWith('auth/logout');
    tick();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Logout unsuccessful',
      3000,
      'error'
    );
  }));
});
