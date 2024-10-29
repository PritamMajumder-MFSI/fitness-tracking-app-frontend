import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDialogComponent } from './workout-dialog.component';

describe('WorkoutDialogComponent', () => {
  let component: WorkoutDialogComponent;
  let fixture: ComponentFixture<WorkoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
