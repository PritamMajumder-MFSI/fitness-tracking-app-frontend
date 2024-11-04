import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsComponent } from './goals.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BackendService } from '../../../services/backend.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastService } from '../../../services/toast.service';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IGoal } from '../../../../models/Goal';
import { GoalDetailsComponent } from '../../../dialogs/goal-details/goal-details.component';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;

  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockBackendService: jasmine.SpyObj<BackendService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj('BackendService', [
      'getApi',
      'postApiCall',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    mockToastService = jasmine.createSpyObj('ToastService', ['add']);
    await TestBed.configureTestingModule({
      imports: [GoalsComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService,
        },
        {
          provide: ToastService,
          useValue: mockToastService,
        },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call fetchGoals on initialization', () => {
    spyOn(component, 'fetchGoals');
    component.ngOnInit();
    expect(component.fetchGoals).toHaveBeenCalledWith(0, 5);
  });

  it('should update dataSource and totalGoals on successful fetchGoals call', async () => {
    const mockGoals: { goals: IGoal[]; totalGoals: number } = {
      goals: [
        {
          goalType: 'specificCalorieGoal',
          targetValue: 10,
          from: new Date(),
          to: new Date(),
          _id: '',
          userId: '',
          isActive: true,
          totalCalories: 0,
          totalWorkouts: 0,
          createdAt: new Date(),
          workouts: [],
          updatedAt: new Date(),
        },
      ],
      totalGoals: 1,
    };
    mockBackendService.getApi.and.returnValue(
      of({
        data: mockGoals,
        success: true,
        message: 'Successfully fetched goals',
      })
    );

    await component.fetchGoals(0, 5);

    expect(component.dataSource).toEqual(mockGoals.goals);
    expect(component.totalGoals).toBe(1);
  });

  it('should show an error toast when fetchGoals fails', async () => {
    mockBackendService.getApi.and.returnValue(
      throwError(() => new Error('Failed to fetch goals'))
    );
    await component.fetchGoals(0, 5);
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Could not fetch goals',
      3000,
      'error'
    );
  });

  it('should handle page change', () => {
    spyOn(component, 'fetchGoals');
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    component.onPageChange(event);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(component.fetchGoals).toHaveBeenCalledWith(1, 10);
  });

  it('should toggle view mode between grid and list', () => {
    expect(component.isGridView).toBe(false);
    component.toggleView();
    expect(component.isGridView).toBe(true);
    component.toggleView();
    expect(component.isGridView).toBe(false);
  });

  it('should open view goal details dialog with correct data', () => {
    const goal: IGoal = {
      goalType: 'specificCalorieGoal',
      targetValue: 10,
      from: new Date(),
      to: new Date(),
      _id: '',
      userId: '',
      isActive: true,
      totalCalories: 0,
      totalWorkouts: 0,
      createdAt: new Date(),
      workouts: [],
      updatedAt: new Date(),
    };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpy);

    component.viewGoalDetails(goal);

    expect(dialogSpy.open).toHaveBeenCalledWith(
      GoalDetailsComponent,
      jasmine.objectContaining({
        data: { goal },
      })
    );
  });
});
