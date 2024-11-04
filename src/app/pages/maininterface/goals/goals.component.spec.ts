import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsComponent } from './goals.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BackendService } from '../../../services/backend.service';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;

  beforeEach(async () => {
    const mockBackendService = jasmine.createSpyObj('BackendService', [
      'getApi',
    ]);
    await TestBed.configureTestingModule({
      imports: [GoalsComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
