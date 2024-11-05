import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { ToastService } from '../../services/toast.service';
import { BackendService } from '../../services/backend.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let mockBackendService: jasmine.SpyObj<BackendService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['getApi']);
    mockToastService = jasmine.createSpyObj('BackendService', ['add']);
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent, NoopAnimationsModule],
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

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
