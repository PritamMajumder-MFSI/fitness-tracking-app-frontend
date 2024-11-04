import { TestBed } from '@angular/core/testing';

import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  let service: ThemingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemingService);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the current mode and modify the document body classes', () => {
    service.updateCurrentMode('dark');
    expect(service.currentMode).toBe('dark');
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(document.body.classList.contains('light')).toBe(false);

    service.updateCurrentMode('light');
    expect(service.currentMode).toBe('light');
    expect(document.body.classList.contains('light')).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
