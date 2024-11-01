import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { IWorkout, IWorkoutWithWorkoutType } from '../../../../models/Workout';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutDialogComponent } from '../../../dialogs/workout-dialog/workout-dialog.component';
import { BackendService } from '../../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../../../services/toast.service';
import { IWorkoutType } from '../../../../models/WorkoutTypes';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [
    MatPaginatorModule,
    CommonModule,
    MatTableModule,
    MatIcon,
    MatButton,
    DatePipe,
  ],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  isGridView = false;
  toggleView() {
    this.isGridView = !this.isGridView;
  }
  displayedColumns: string[] = [
    'type',
    'duration',
    'calories',
    'date',
    'actions',
  ];
  dataSource: IWorkoutWithWorkoutType[] = [];
  workoutTypes: IWorkoutType[] = [];

  totalWorkouts = 0;
  pageSize = 5;
  pageIndex = 0;
  dateFormat: string = 'dd/MM/yyyy';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly platform = inject(PLATFORM_ID);
  constructor(
    private dialog: MatDialog,
    private backendService: BackendService,
    private toastService: ToastService
  ) {
    if (isPlatformBrowser(this.platform)) {
      const storedFormat = localStorage.getItem('dateFormat');
      if (storedFormat == '2') {
        this.dateFormat = 'MM/dd/yyyy';
      } else {
        this.dateFormat = 'dd/MM/yyyy';
      }
    }
  }
  ngOnInit() {
    this.fetchWorkouts(this.pageIndex, this.pageSize);
    this.fetchWorkoutTypes();
  }
  async fetchWorkoutTypes() {
    try {
      const result = await lastValueFrom(
        this.backendService.getApi<IWorkoutType[]>('workout/workout-types')
      );
      this.workoutTypes = result.data;
    } catch (err) {
      this.toastService.add('Could not fetch workout types', 3000, 'error');
    }
  }
  async fetchWorkouts(page: number, limit: number) {
    try {
      const result = await lastValueFrom(
        this.backendService.getApi<{
          workouts: IWorkoutWithWorkoutType[];
          total: number;
        }>(`workout?page=${page + 1}&limit=${limit}`)
      );
      this.dataSource = result.data.workouts;
      this.totalWorkouts = result.data.total;
    } catch (err) {
      this.toastService.add('Could not fetch workouts', 3000, 'error');
    }
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchWorkouts(this.pageIndex, this.pageSize);
  }
  editWorkout(workout: IWorkout) {
    console.log('Editing workout:', workout);
    let dialogRef = this.dialog.open(WorkoutDialogComponent, {
      data: { workoutTypes: this.workoutTypes, workout },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      try {
        await lastValueFrom(
          this.backendService.patchApiCall('workout', result)
        );
        this.toastService.add('Workout updated successfully', 3000, 'success');
        this.fetchWorkouts(this.pageIndex, this.pageSize);
      } catch (err) {
        this.toastService.add('Failed to update workout', 3000, 'error');
      }
    });
  }

  async deleteWorkout(id: string) {
    console.log(id);
    try {
      await lastValueFrom(
        this.backendService.patchApiCall('workout', {
          _id: id,
          isActive: false,
        })
      );
      this.dataSource = this.dataSource.filter((workout) => workout._id !== id);
      this.toastService.add('Workout deleted successfully', 3000, 'success');
    } catch (err) {
      this.toastService.add('Failed to delete workout', 3000, 'error');
    }
  }
  createWorkout() {
    let dialogRef = this.dialog.open(WorkoutDialogComponent, {
      data: { workoutTypes: this.workoutTypes },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      try {
        await lastValueFrom(this.backendService.postApiCall('workout', result));
        this.toastService.add('Workout created successfully', 3000, 'success');
        this.fetchWorkouts(this.pageIndex, this.pageSize);
      } catch (err) {
        this.toastService.add('Failed to create workout', 3000, 'error');
      }
    });
  }
}
