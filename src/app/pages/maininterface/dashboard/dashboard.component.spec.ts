import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { BackendService } from '../../../services/backend.service';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockBackendService: jasmine.SpyObj<BackendService>;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', ['getApi']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getDashboardInfo and getDashboardInfoByDay on initialization', () => {
    const getDashboardInfoSpy = spyOn(component, 'getDashboardInfo');
    const getDashboardInfoByDaySpy = spyOn(component, 'getDashboardInfoByDay');

    component.ngOnInit();

    expect(getDashboardInfoSpy).toHaveBeenCalled();
    expect(getDashboardInfoByDaySpy).toHaveBeenCalledWith(7);
  });

  it('should create calories chart with given data', () => {
    const mockData = [
      {
        label: 'Jan',
        totalCalories: 500,
        totalWorkouts: 3,
        workoutTypes: ['Cardio'],
      },
      {
        label: 'Feb',
        totalCalories: 600,
        totalWorkouts: 4,
        workoutTypes: ['Strength'],
      },
    ];
    spyOn(component, 'createCaloriesChart');
    spyOn(component, 'createWorkoutsChart');
    spyOn(component, 'createTypesChart');

    component.createCharts(mockData);

    expect(component.createCaloriesChart).toHaveBeenCalledWith(
      ['Jan', 'Feb'],
      [500, 600]
    );
    expect(component.createWorkoutsChart).toHaveBeenCalledWith(
      ['Jan', 'Feb'],
      [3, 4]
    );
    expect(component.createTypesChart).toHaveBeenCalled();
  });

  it('should calculate workout types from data correctly', () => {
    const mockData = [
      { workoutTypes: ['Cardio', 'Strength'] },
      { workoutTypes: ['Cardio', 'Flexibility'] },
    ];
    const workoutTypes = component.getWorkoutsByType(mockData);

    expect(workoutTypes).toEqual([
      { type: 'Cardio', count: 2 },
      { type: 'Strength', count: 1 },
      { type: 'Flexibility', count: 1 },
    ]);
  });
});
