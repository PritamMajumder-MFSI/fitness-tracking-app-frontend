import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDetailsComponent } from './goal-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('GoalDetailsComponent', () => {
  let component: GoalDetailsComponent;
  let fixture: ComponentFixture<GoalDetailsComponent>;

  beforeEach(async () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close'),
    };
    await TestBed.configureTestingModule({
      imports: [GoalDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
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

  it('should set date format based on localStorage', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return '2';
    });

    component = TestBed.createComponent(GoalDetailsComponent).componentInstance;
    expect(component.dateFormat).toBe('MM/dd/yyyy');
  });

  it('should create charts after view init', () => {
    spyOn(component, 'createCharts');
    component.ngAfterViewInit();
    expect(component.createCharts).toHaveBeenCalled();
  });

  it('should create calories chart correctly', () => {
    component.chartCaloriesRef = {
      nativeElement: document.createElement('canvas'),
    };
    component.createCaloriesChart(['01 Nov', '02 Nov'], [800, 250]);
    expect(component.chartCalories).toBeDefined();
    expect(component.chartCalories.data.labels).toEqual(['01 Nov', '02 Nov']);
    expect(component.chartCalories.data.datasets[0].data).toEqual([800, 250]);
  });

  it('should handle ngOnDestroy', () => {
    component.chartCalories = {
      destroy: () => {
        console.log('destroy');
      },
    };
    spyOn(component.chartCalories, 'destroy');
    component.ngOnDestroy();
    expect(component.chartCalories.destroy).toHaveBeenCalled();
  });
});
