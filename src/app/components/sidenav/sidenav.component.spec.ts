import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { BackendService } from '../../services/backend.service';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    const mockBackendService = jasmine.createSpyObj('BackendService', [
      'getApi',
    ]);
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
