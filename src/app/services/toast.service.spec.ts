import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should remove a toast after the specified duration', fakeAsync(() => {
    service.add('Test message', 1000, 'success');
    expect(service.toasts.length).toBe(1);
    tick(1000);
    expect(service.toasts.length).toBe(0);
  }));

  it('should allow multiple toasts', fakeAsync(() => {
    service.add('First message', 1000, 'success');
    service.add('Second message', 1000, 'error');

    expect(service.toasts.length).toBe(2);

    tick(1000);

    expect(service.toasts.length).toBe(0);
  }));
});
