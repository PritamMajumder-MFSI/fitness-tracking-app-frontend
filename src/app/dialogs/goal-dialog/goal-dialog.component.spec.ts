import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDialogComponent } from './goal-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('GoalDialogComponent', () => {
  let component: GoalDialogComponent;
  let fixture: ComponentFixture<GoalDialogComponent>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<GoalDialogComponent>>;
  beforeEach(async () => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [GoalDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not close dialog on wrong submit', () => {
    component.goalForm.setValue({
      goalType: '',
      targetValue: -1,
      from: '',
      to: '',
    });

    component.onSubmit();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});
