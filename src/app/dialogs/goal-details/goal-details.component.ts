import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { Chart, registerables } from 'chart.js';
import { FormatCamelCasePipe } from '../../pipes/format-camel-case.pipe';
import { IWorkoutWithType } from '../../../models/Goal';

Chart.register(...registerables);

@Component({
  selector: 'app-goal-details',
  standalone: true,
  imports: [MatDivider, MatButton, DatePipe, FormatCamelCasePipe],
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss'],
})
export class GoalDetailsComponent implements AfterViewInit {
  @ViewChild('chartCalories') chartCaloriesRef!: ElementRef;
  @ViewChild('chartWorkouts') chartWorkoutsRef!: ElementRef;
  @ViewChild('chartTypes') chartTypesRef!: ElementRef;
  @ViewChild('chartProgress') chartProgressRef!: ElementRef;

  chartCalories: any;
  chartWorkouts: any;
  chartTypes: any;
  chartProgress: any;

  dateFormat: string = 'dd/MM/yyyy';

  private readonly platform = inject(PLATFORM_ID);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GoalDetailsComponent>
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

  ngAfterViewInit(): void {
    this.createCharts();
  }

  ngOnDestroy(): void {
    this.chartCalories?.destroy();
    this.chartWorkouts?.destroy();
    this.chartTypes?.destroy();
    this.chartProgress?.destroy();
  }

  createCharts(): void {
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

  getUniqueDates(workouts: any[]): string[] {
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

  getCaloriesPerDate(workouts: any[], dates: string[]): number[] {
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

  getWorkoutsPerDate(workouts: any[], dates: string[]): number[] {
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
    const typesMap = new Map();
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

  createCaloriesChart(dates: string[], calories: number[]): void {
    this.chartCalories = new Chart(this.chartCaloriesRef.nativeElement, {
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
    });
  }

  createWorkoutsChart(dates: string[], workouts: number[]): void {
    this.chartWorkouts = new Chart(this.chartWorkoutsRef.nativeElement, {
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
    });
  }

  createTypesChart(workoutTypes: { type: string; count: number }[]): void {
    this.chartTypes = new Chart(this.chartTypesRef.nativeElement, {
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
    });
  }

  createProgressChart(progress: number): void {
    this.chartProgress = new Chart(this.chartProgressRef.nativeElement, {
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
    });
  }
}
