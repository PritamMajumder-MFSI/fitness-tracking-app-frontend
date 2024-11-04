import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
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
interface WorkoutData {
  workout?: {
    _id?: string;
    date: string;
    duration: number;
    calories: number;
    type: string;
  };
}
@Component({
  selector: 'app-workout-dialog',
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
  templateUrl: './workout-dialog.component.html',
  styleUrls: ['./workout-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutDialogComponent implements OnInit {
  public workoutForm: FormGroup;

  public today = new Date();
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WorkoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkoutData
  ) {
    this.workoutForm = this.fb.group({
      type: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      calories: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
    });
  }
  ngOnInit() {
    if (this.data?.workout) {
      this.workoutForm.setValue({
        date: this.data?.workout?.date,
        duration: this.data?.workout?.duration,
        calories: this.data?.workout?.calories,
        type: this.data?.workout.type,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const response = this.workoutForm.value;
      if (this.data.workout) {
        response._id = this.data.workout._id;
      }
      this.dialogRef.close(response);
    }
  }

  public getErrorMessage = getErrorMessage;
}
