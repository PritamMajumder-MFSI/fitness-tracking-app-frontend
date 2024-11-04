import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningModelComponent } from './running-model.component';

describe('RunningModelComponent', () => {
  let component: RunningModelComponent;
  let fixture: ComponentFixture<RunningModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningModelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningModelComponent);
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
