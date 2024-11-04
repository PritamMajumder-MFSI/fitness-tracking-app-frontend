import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { FormatCamelCasePipe } from '../../pipes/format-camel-case.pipe';
import { IWorkoutWithType } from '../../../models/Goal';

Chart.register(...registerables);

@Component({
  selector: 'app-goal-details',
  standalone: true,
  imports: [MatDivider, MatButton, DatePipe, FormatCamelCasePipe],
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCalories') chartCaloriesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartWorkouts') chartWorkoutsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTypes') chartTypesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartProgress') chartProgressRef!: ElementRef<HTMLCanvasElement>;

  chartCalories?: Chart<'line', number[], string>;
  chartWorkouts?: Chart<'bar', number[], string>;
  chartTypes?: Chart<'pie', number[], string>;
  chartProgress?: Chart<'doughnut', number[], string>;

  dateFormat = 'dd/MM/yyyy';

  private readonly platform = inject(PLATFORM_ID);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      goal: {
        workouts: IWorkoutWithType[];
        targetValue: number;
        goalType: string;
      };
    },
    public dialogRef: MatDialogRef<GoalDetailsComponent>
  ) {
    if (isPlatformBrowser(this.platform)) {
      const storedFormat = localStorage.getItem('dateFormat');
      this.dateFormat = storedFormat === '2' ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
    }
  }

  ngAfterViewInit() {
    this.createCharts();
  }

  ngOnDestroy() {
    this.chartCalories?.destroy();
    this.chartWorkouts?.destroy();
    this.chartTypes?.destroy();
    this.chartProgress?.destroy();
  }

  createCharts() {
    const { workouts, targetValue, goalType } = this.data.goal;

    const dates = this.getUniqueDates(workouts);
    const caloriesData = this.getCaloriesPerDate(workouts, dates);
    const workoutsData = this.getWorkoutsPerDate(workouts, dates);
    const workoutTypes = this.getWorkoutsByType(workouts);
    const progress = this.calculateProgress(workouts, targetValue, goalType);

    this.createCaloriesChart(dates, caloriesData);
    this.createWorkoutsChart(dates, workoutsData);
    this.createTypesChart(workoutTypes);
    this.createProgressChart(progress);
  }

  getUniqueDates(workouts: IWorkoutWithType[]): string[] {
    const dateSet = new Set(
      workouts.map((w) =>
        new Date(w.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })
      )
    );
    return Array.from(dateSet);
  }

  getCaloriesPerDate(workouts: IWorkoutWithType[], dates: string[]): number[] {
    return dates.map((date) =>
      workouts
        .filter(
          (w) =>
            new Date(w.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            }) === date
        )
        .reduce((total, w) => total + w.calories, 0)
    );
  }

  getWorkoutsPerDate(workouts: IWorkoutWithType[], dates: string[]): number[] {
    return dates.map(
      (date) =>
        workouts.filter(
          (w) =>
            new Date(w.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            }) === date
        ).length
    );
  }

  getWorkoutsByType(
    workouts: IWorkoutWithType[]
  ): { type: string; count: number }[] {
    const typesMap = new Map<string, number>();
    workouts.forEach((w) => {
      typesMap.set(
        w.typeInfo.workoutTypeName,
        (typesMap.get(w.typeInfo.workoutTypeName) || 0) + 1
      );
    });
    return Array.from(typesMap, ([type, count]) => ({ type, count }));
  }

  calculateProgress(
    workouts: IWorkoutWithType[],
    targetValue: number,
    goalType: string
  ): number {
    let totalAchieved: number;

    if (goalType === 'workoutPerWeek') {
      totalAchieved = workouts.length;
    } else if (goalType === 'specificCalorieGoal') {
      totalAchieved = workouts.reduce((total, w) => total + w.calories, 0);
    } else {
      totalAchieved = 0;
    }

    return Math.min((totalAchieved / targetValue) * 100, 100);
  }

  createCaloriesChart(dates: string[], calories: number[]) {
    const config: ChartConfiguration<'line', number[], string> = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Calories Burned',
            data: calories,
            borderColor: '#42A5F5',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chartCalories = new Chart(this.chartCaloriesRef.nativeElement, config);
  }

  createWorkoutsChart(dates: string[], workouts: number[]) {
    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Workouts Done',
            data: workouts,
            backgroundColor: '#66BB6A',
            maxBarThickness: 30,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chartWorkouts = new Chart(this.chartWorkoutsRef.nativeElement, config);
  }

  createTypesChart(workoutTypes: { type: string; count: number }[]) {
    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: workoutTypes.map((w) => w.type),
        datasets: [
          {
            data: workoutTypes.map((w) => w.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chartTypes = new Chart(this.chartTypesRef.nativeElement, config);
  }

  createProgressChart(progress: number) {
    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [
          {
            data: [progress, 100 - progress],
            backgroundColor: ['#4CAF50', '#E0E0E0'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chartProgress = new Chart(this.chartProgressRef.nativeElement, config);
  }
}
