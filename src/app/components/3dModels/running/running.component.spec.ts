import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningComponent } from './running.component';

describe('RunningComponent', () => {
  let component: RunningComponent;
  let fixture: ComponentFixture<RunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the scene and camera on AfterViewInit', () => {
    spyOn(component, 'createThreeJsBox').and.callThrough();
    component.ngAfterViewInit();
    expect(component.createThreeJsBox).toHaveBeenCalled();
  });
});
