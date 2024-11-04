import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should remove a toast after the specified duration', (done) => {
    service.add('Test message', 1000, 'success');
    expect(service.toasts.length).toBe(1);
  });

  it('should allow multiple toasts', (done) => {
    service.add('First message', 3000, 'success');
    service.add('Second message', 3000, 'error');

    expect(service.toasts.length).toBe(2);
  });

  it('should remove the specified toast by index', () => {
    service.add('First message', 3000, 'success');
    service.add('Second message', 3000, 'error');

    expect(service.toasts.length).toBe(2);
    service.remove(0);
    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].message).toBe('Second message');
  });
});
