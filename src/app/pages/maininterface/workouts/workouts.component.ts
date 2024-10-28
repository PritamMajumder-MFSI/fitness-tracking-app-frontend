import { Component, OnInit } from '@angular/core';
import { IWorkout } from '../../../../models/Workout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatIcon, MatButton],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'duration', 'type', 'actions'];
  dataSource: IWorkout[] = [];

  ngOnInit() {
    this.fetchWorkouts();
  }

  fetchWorkouts() {
    const workouts: IWorkout[] = [
      {
        _id: '2',
        type: 'Cycling',
        duration: 45,
        calories: 400,
        userId: 'user2',
        date: new Date('2024-10-05'),
        isActive: true,
        createdAt: new Date('2024-10-01T11:00:00Z'),
      },
      {
        _id: '3',
        type: 'Swimming',
        duration: 60,
        calories: 500,
        userId: 'user1',
        date: new Date('2024-10-10'),
        isActive: false,
        createdAt: new Date('2024-10-02T12:00:00Z'),
      },
      {
        _id: '4',
        type: 'Yoga',
        duration: 40,
        calories: 200,
        userId: 'user3',
        date: new Date('2024-10-15'),
        isActive: true,
        createdAt: new Date('2024-10-03T14:00:00Z'),
      },
      {
        _id: '5',
        type: 'Weight Lifting',
        duration: 50,
        calories: 600,
        userId: 'user2',
        date: new Date('2024-10-20'),
        isActive: true,
        createdAt: new Date('2024-10-04T09:00:00Z'),
      },
      {
        _id: '6',
        type: 'HIIT',
        duration: 30,
        calories: 350,
        userId: 'user3',
        date: new Date('2024-10-25'),
        isActive: false,
        createdAt: new Date('2024-10-05T16:00:00Z'),
      },
    ];

    this.dataSource = workouts;
  }

  editWorkout(workout: IWorkout) {
    console.log('Editing workout:', workout);
  }

  deleteWorkout(id: string) {
    this.dataSource = this.dataSource.filter((workout) => workout._id !== id);
  }
}
