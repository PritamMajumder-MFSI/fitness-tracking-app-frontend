import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpLoaderService } from './services/http-loader.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fitness-tracker-frontend';
  loading: boolean = false;

  constructor(
    public toastService: ToastService,
    private _loading: HttpLoaderService
  ) {}
  ngOnInit() {
    this.listenToLoading();
  }
  showToast() {
    this.toastService.add('This is a toast message.');
  }
  removeToast(index: number) {
    this.toastService.remove(index);
  }
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
