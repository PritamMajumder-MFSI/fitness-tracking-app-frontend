import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsComponent } from './workouts.component';
import { BackendService } from '../../../services/backend.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkoutsComponent', () => {
  let component: WorkoutsComponent;
  let fixture: ComponentFixture<WorkoutsComponent>;

  beforeEach(async () => {
    const mockBackendService = jasmine.createSpyObj('BackendService', [
      'getApi',
      'postApiCall',
      'patchApiCall',
    ]);
    await TestBed.configureTestingModule({
      imports: [WorkoutsComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
