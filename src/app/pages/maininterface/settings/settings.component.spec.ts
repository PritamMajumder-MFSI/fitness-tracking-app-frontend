import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '../../../services/toast.service';
import { ThemingService } from '../../../services/theming.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let mockToastService: jasmine.SpyObj<ToastService>;

  let mockThemingService: jasmine.SpyObj<ThemingService>;
  beforeEach(async () => {
    mockToastService = jasmine.createSpyObj('ToastService', ['add']);
    mockThemingService = jasmine.createSpyObj('ThemingService', [
      'updateCurrentMode',
    ]);
    await TestBed.configureTestingModule({
      imports: [SettingsComponent, NoopAnimationsModule],
      providers: [
        { provide: ToastService, useValue: mockToastService },
        { provide: ThemingService, useValue: mockThemingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values if no settings are stored', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.getSettings();
    expect(component.settingsForm.value).toEqual({
      theme: 'dark',
      dateFormat: 1,
    });
  });

  it('should populate form with saved settings from localStorage', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'theme') return 'light';
      if (key === 'dateFormat') return '2';
      return null;
    });
    component.getSettings();
    expect(component.settingsForm.value).toEqual({
      theme: 'light',
      dateFormat: 2,
    });
  });

  it('should save settings with valid data and show success toast', () => {
    component.settingsForm.setValue({ theme: 'light', dateFormat: 2 });
    component.saveUserDetails();
    expect(mockThemingService.updateCurrentMode).toHaveBeenCalledWith('light');
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Settings saved successfully!',
      3000,
      'success'
    );
  });

  it('should not save settings if form is invalid and show error toast', () => {
    component.settingsForm.setValue({ theme: '', dateFormat: '' });
    component.saveUserDetails();
    expect(mockToastService.add).toHaveBeenCalledWith(
      'Please make sure all the inputs are valid!',
      3000,
      'error'
    );
  });
});
