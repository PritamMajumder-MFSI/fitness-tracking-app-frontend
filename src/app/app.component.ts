import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpLoaderService } from './services/http-loader.service';
import { delay } from 'rxjs/operators';
import { ThemingService } from './services/theming.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'fitness-tracker-frontend';
  loading = false;

  constructor(
    public toastService: ToastService,
    private _loading: HttpLoaderService,
    private themingService: ThemingService
  ) {}
  ngOnInit() {
    this.listenToLoading();
    console.log(this.themingService.currentMode);
  }
  showToast() {
    this.toastService.add('This is a toast message.');
  }
  removeToast(index: number) {
    this.toastService.remove(index);
  }
  listenToLoading() {
    this._loading.loadingSub.pipe(delay(0)).subscribe((loading) => {
      this.loading = loading;
    });
  }
}
