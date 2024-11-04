import { Component, ElementRef, ViewChild } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { IDashboardResponse } from '../../../../models/DashboardInfo';
import { MatTableModule } from '@angular/material/table';
import { FormatCamelCasePipe } from '../../../pipes/format-camel-case.pipe';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart, registerables } from 'chart.js';
import { MatDividerModule } from '@angular/material/divider';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormatCamelCasePipe,
    MatDividerModule,
    RouterLink,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  workouts: any[] = [];
  goals: any[] = [];
  totalCalories: number = 0;
  totalWorkouts: number = 0;
  dashboardInfo: IDashboardResponse | undefined;
  goalDisplayedColumns: string[] = ['goalType', 'targetValue', 'progress'];
  workoutDisplayedColumns: string[] = ['type', 'duration', 'calories'];
  days: number = 7;
  caloriesChart: Chart | undefined;
  workoutsChart: Chart | undefined;
  typesChart: any;
  @ViewChild('chartCalories') chartCaloriesRef!: ElementRef;
  @ViewChild('chartWorkouts') chartWorkoutsRef!: ElementRef;
  @ViewChild('chartTypes') chartTypesRef!: ElementRef;

  constructor(private backendService: BackendService) {
    this.goals = [
      { type: 'Weekly Workouts', targetValue: 5, achievedValue: 3 },
      { type: 'Caloric Intake', targetValue: 2000, achievedValue: 1500 },
    ];
  }

  ngOnInit() {
    this.getDashboardInfo();
    this.getDashboardInfoByDay(this.days);
  }
  async getDashboardInfo() {
    const result = await lastValueFrom(
      this.backendService.getApi<IDashboardResponse | undefined>(
        'dashboard/get-info'
      )
    );
    this.dashboardInfo = result.data;
  }

  async getDashboardInfoByDay(days: number) {
    const result = await lastValueFrom(
      this.backendService.getApi<any>('dashboard/get-info-by-date', {
        days: String(days),
      })
    );
    this.createCharts(result.data);
  }

  createCharts(data: any[]) {
    const labels = data.map((day) => day.label);
    const caloriesData = data.map((day) => day.totalCalories);
    const workoutsData = data.map((day) => day.totalWorkouts);
    const workoutTypesData = this.getWorkoutsByType(data);
    this.createCaloriesChart(labels, caloriesData);
    this.createWorkoutsChart(labels, workoutsData);
    this.createTypesChart(workoutTypesData);
  }

  getWorkoutsByType(data: any[]): { type: string; count: number }[] {
    const typesMap = new Map<string, number>();
    data.forEach((day) => {
      day.workoutTypes.forEach((type: string) => {
        typesMap.set(type, (typesMap.get(type) || 0) + 1);
      });
    });
    return Array.from(typesMap, ([type, count]) => ({ type, count }));
  }

  createCaloriesChart(labels: string[], calories: number[]) {
    if (this.caloriesChart) {
      this.caloriesChart.destroy();
    }
    this.caloriesChart = new Chart(this.chartCaloriesRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
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

  createWorkoutsChart(labels: string[], workouts: number[]) {
    if (this.workoutsChart) {
      this.workoutsChart.destroy();
    }
    this.workoutsChart = new Chart(this.chartWorkoutsRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
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

  createTypesChart(workoutTypes: { type: string; count: number }[]) {
    if (this.typesChart) {
      this.typesChart.destroy();
    }
    this.typesChart = new Chart(this.chartTypesRef.nativeElement, {
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

  getValue(goal: any) {
    if (goal.goalType === 'workoutPerWeek') {
      return (goal.totalWorkouts / goal.targetValue) * 100;
    } else {
      return (goal.totalCalories / goal.targetValue) * 100;
    }
  }
  fetchData(days: number) {
    this.days = days;
    this.getDashboardInfoByDay(days);
  }
}
