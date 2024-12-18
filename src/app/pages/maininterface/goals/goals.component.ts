import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from '../../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../../../services/toast.service';
import { CommonModule, DatePipe } from '@angular/common';
import { GoalDialogComponent } from '../../../dialogs/goal-dialog/goal-dialog.component';
import { IGoal } from '../../../../models/Goal';
import { FormatCamelCasePipe } from '../../../pipes/format-camel-case.pipe';
import { GoalDetailsComponent } from '../../../dialogs/goal-details/goal-details.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatIcon,
    MatButton,
    DatePipe,
    FormatCamelCasePipe,
    CommonModule,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent implements OnInit {
  displayedColumns: string[] = [
    'goalType',
    'targetValue',
    'from',
    'to',
    'actions',
  ];
  dataSource: IGoal[] = [];

  totalGoals = 0;
  pageSize = 5;
  pageIndex = 0;
  isGridView = false;
  dateFormat = 'dd/MM/yyyy';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private backendService: BackendService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {
    const storedFormat = localStorage.getItem('dateFormat');
    console.log(storedFormat, storedFormat == '2');
    if (storedFormat == '2') {
      this.dateFormat = 'MM/dd/yyyy';
    } else {
      this.dateFormat = 'dd/MM/yyyy';
    }
  }
  ngOnInit() {
    this.fetchGoals(this.pageIndex, this.pageSize);
  }

  async fetchGoals(page: number, limit: number) {
    try {
      const result = await lastValueFrom(
        this.backendService.getApi<{ goals: IGoal[]; totalGoals: number }>(
          `goal?page=${page + 1}&limit=${limit}`
        )
      );
      this.dataSource = result.data.goals;
      this.totalGoals = result.data.totalGoals;
      this.cd.detectChanges();
    } catch (err) {
      console.log(err);
      this.toastService.add('Could not fetch goals', 3000, 'error');
    }
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchGoals(this.pageIndex, this.pageSize);
  }

  createGoal() {
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      try {
        await lastValueFrom(this.backendService.postApiCall('goal', result));
        this.toastService.add('Goal created successfully', 3000, 'success');
        this.fetchGoals(this.pageIndex, this.pageSize);
      } catch (err) {
        console.log(err);
        this.toastService.add('Failed to create goal', 3000, 'error');
      }
    });
  }
  viewGoalDetails(goal: IGoal) {
    const dialogRef = this.dialog.open(GoalDetailsComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      data: {
        goal,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed', result);
    });
  }
  toggleView() {
    this.isGridView = !this.isGridView;
  }
}
