import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDetailsComponent } from './goal-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('GoalDetailsComponent', () => {
  let component: GoalDetailsComponent;
  let fixture: ComponentFixture<GoalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            goal: {
              workouts: [
                {
                  date: '2024-11-04',
                  calories: 200,
                  typeInfo: { workoutTypeName: 'Running' },
                },
                {
                  date: '2024-11-05',
                  calories: 300,
                  typeInfo: { workoutTypeName: 'Cycling' },
                },
              ],
              targetValue: 1000,
              goalType: 'specificCalorieGoal',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
