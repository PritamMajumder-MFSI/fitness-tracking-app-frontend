import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { WorkoutsComponent } from './workouts.component';
import { BackendService } from '../../../services/backend.service';
import { ToastService } from '../../../services/toast.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';
import { IWorkout, IWorkoutWithWorkoutType } from '../../../../models/Workout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutDialogComponent } from '../../../dialogs/workout-dialog/workout-dialog.component';

describe('WorkoutsComponent', () => {
  let component: WorkoutsComponent;
  let fixture: ComponentFixture<WorkoutsComponent>;
  let backendService: jasmine.SpyObj<BackendService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<WorkoutDialogComponent>>;
  beforeEach(async () => {
    backendService = jasmine.createSpyObj('BackendService', [
      'getApi',
      'patchApiCall',
      'postApiCall',
    ]);
    toastService = jasmine.createSpyObj('ToastService', ['add']);
    mockDialogRef = jasmine.createSpyObj<MatDialogRef<WorkoutDialogComponent>>(
      'MatDialogRef',
      ['afterClosed', 'close', 'componentInstance']
    );
    mockDialogRef.afterClosed.and.returnValue(
      of({
        duration: 30,
        type: 'Cardio',
        _id: '1',
        calories: 12,
        userId: '',
        date: new Date(),
        isActive: true,
        createdAt: new Date(),
      })
    );

    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialog.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: BackendService, useValue: backendService },
        { provide: ToastService, useValue: toastService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchWorkouts and fetchWorkoutTypes on init', () => {
    spyOn(component, 'fetchWorkouts').and.callThrough();
    spyOn(component, 'fetchWorkoutTypes').and.callThrough();

    component.ngOnInit();

    expect(component.fetchWorkouts).toHaveBeenCalledWith(0, 5);
    expect(component.fetchWorkoutTypes).toHaveBeenCalled();
  });

  it('should set dateFormat from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('2');

    fixture.detectChanges();

    expect(component.dateFormat).toBe('MM/dd/yyyy');
  });

  it('should fetch workouts successfully', async () => {
    const mockWorkouts: {
      data: { workouts: IWorkoutWithWorkoutType[]; total: number };
      success: boolean;
      message: string;
    } = {
      data: {
        workouts: [
          {
            _id: '1',
            type: 'Cardio',
            duration: 30,
            calories: 12,
            workoutType: [],
            userId: '',
            date: new Date(),
            isActive: true,
            createdAt: new Date(),
          },
        ],
        total: 1,
      },
      success: true,
      message: 'Successfully fetched workouts',
    };
    backendService.getApi.and.returnValue(of(mockWorkouts));

    await component.fetchWorkouts(0, 5);

    expect(component.dataSource).toEqual(mockWorkouts.data.workouts);
    expect(component.totalWorkouts).toBe(mockWorkouts.data.total);
  });

  it('should handle fetch workouts error', async () => {
    backendService.getApi.and.returnValue(throwError(() => new Error('Error')));

    await component.fetchWorkouts(0, 5);

    expect(toastService.add).toHaveBeenCalledWith(
      'Could not fetch workouts',
      3000,
      'error'
    );
  });
  it('should open dialog and create workout', fakeAsync(() => {
    const newWorkout = {
      duration: 30,
      type: 'Cardio',
      _id: '1',
      calories: 12,
      userId: '',
      date: new Date(),
      isActive: true,
      createdAt: new Date(),
    };

    mockDialogRef.afterClosed.and.returnValue(of(newWorkout));

    backendService.postApiCall.and.returnValue(
      of({ success: true, data: {}, message: '' })
    );

    component.createWorkout();
    tick();
    expect(dialog.open).toHaveBeenCalled();
    expect(backendService.postApiCall).toHaveBeenCalledWith(
      'workout',
      newWorkout
    );
    expect(toastService.add).toHaveBeenCalledWith(
      'Workout created successfully',
      3000,
      'success'
    );
  }));

  it('should handle edit workout dialog close and update', fakeAsync(() => {
    const mockWorkout: IWorkout = {
      _id: '1',
      type: 'Yoga',
      duration: 30,
      calories: 0,
      userId: '',
      date: new Date(),
      isActive: true,
      createdAt: new Date(),
    };

    const updatedWorkout = { ...mockWorkout, duration: 70 };

    mockDialogRef.afterClosed.and.returnValue(of(updatedWorkout));

    backendService.patchApiCall.and.returnValue(
      of({ success: true, data: {}, message: '' })
    );

    component.editWorkout(mockWorkout);
    tick();
    expect(dialog.open).toHaveBeenCalled();
    expect(backendService.patchApiCall).toHaveBeenCalledWith(
      'workout',
      jasmine.objectContaining({ duration: 70 })
    );
    expect(toastService.add).toHaveBeenCalledWith(
      'Workout updated successfully',
      3000,
      'success'
    );
  }));

  it('should handle delete workout', async () => {
    backendService.patchApiCall.and.returnValue(
      of({ success: true, message: 'Successfully patched', data: {} })
    );

    const mockWorkouts: IWorkoutWithWorkoutType[] = [
      {
        _id: '1',
        type: 'Cardio',
        duration: 30,
        calories: 12,
        workoutType: [],
        userId: '',
        date: new Date(),
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: '2',
        type: 'Strength',
        duration: 45,
        calories: 12,
        workoutType: [],
        userId: '',
        date: new Date(),
        isActive: true,
        createdAt: new Date(),
      },
    ];

    component.dataSource = mockWorkouts;
    await component.deleteWorkout('1');

    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0]._id).toBe('2');
    expect(toastService.add).toHaveBeenCalledWith(
      'Workout deleted successfully',
      3000,
      'success'
    );
  });

  it('should handle pagination change', () => {
    spyOn(component, 'fetchWorkouts');
    const pageEvent = { pageIndex: 1, pageSize: 10 } as PageEvent;

    component.onPageChange(pageEvent);

    expect(component.fetchWorkouts).toHaveBeenCalledWith(1, 10);
  });
});
