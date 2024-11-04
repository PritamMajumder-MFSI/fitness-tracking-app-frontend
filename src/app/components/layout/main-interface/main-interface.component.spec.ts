import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInterfaceComponent } from './main-interface.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { BackendService } from '../../../services/backend.service';

describe('MainInterfaceComponent', () => {
  let component: MainInterfaceComponent;
  let fixture: ComponentFixture<MainInterfaceComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
