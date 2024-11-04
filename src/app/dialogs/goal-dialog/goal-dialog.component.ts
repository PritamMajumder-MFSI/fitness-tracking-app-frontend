import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import getErrorMessage from '../../../utils/getErrorMessage';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { IGoal } from '../../../models/Goal';

@Component({
  selector: 'app-goal-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    CommonModule,
    MatButton,
    MatDatepickerModule,
    MatDividerModule,
    MatSelectModule,
  ],
  templateUrl: './goal-dialog.component.html',
  styleUrl: './goal-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDialogComponent {
  public goalForm: FormGroup;
  public today = new Date();
  public goalTypes = [
    { value: 'workoutPerWeek', displayName: 'Workout per week' },
    { value: 'specificCalorieGoal', displayName: 'Specific calorie goal' },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGoal
  ) {
    this.goalForm = this.fb.group({
      goalType: ['', Validators.required],
      targetValue: ['', [Validators.required, Validators.min(0)]],
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.goalForm.valid) {
      const response = this.goalForm.value;
      this.dialogRef.close(response);
    }
  }

  public getErrorMessage = getErrorMessage;
}
