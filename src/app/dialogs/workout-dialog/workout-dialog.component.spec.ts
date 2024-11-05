import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDialogComponent } from './workout-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkoutDialogComponent', () => {
  let component: WorkoutDialogComponent;
  let fixture: ComponentFixture<WorkoutDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<WorkoutDialogComponent>>;
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [WorkoutDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { workout: null } },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close on onCancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call dialogRef.close with form value on onSubmit if form is valid', () => {
    component.workoutForm.setValue({
      type: 'Strength',
      duration: 45,
      calories: 300,
      date: '2024-11-01',
    });
    component.onSubmit();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      type: 'Strength',
      duration: 45,
      calories: 300,
      date: '2024-11-01',
    });
  });

  it('should not call dialogRef.close on onSubmit if form is invalid', () => {
    component.workoutForm.setValue({
      type: '',
      duration: 0,
      calories: -10,
      date: '',
    });
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
