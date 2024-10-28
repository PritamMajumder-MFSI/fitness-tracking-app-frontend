import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fitness-tracker-frontend';
  constructor(public toastService: ToastService) {}

  showToast() {
    this.toastService.add('This is a toast message.');
  }
  removeToast(index: number) {
    this.toastService.remove(index);
  }
}
