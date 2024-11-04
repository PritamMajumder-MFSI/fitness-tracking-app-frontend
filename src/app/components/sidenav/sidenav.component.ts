import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { BackendService } from '../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  @Output() public closeDrawerEvent = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    public authService: AuthServiceService,
    private backendService: BackendService,
    private toastService: ToastService
  ) {}
  public sidenavItems = [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'dashboard',
    },
    {
      title: 'Workouts',
      route: '/workouts',
      icon: 'fitness_center',
    },
    {
      title: 'Goals',
      route: '/goals',
      icon: 'flag',
    },
    {
      title: 'Settings',
      route: '/settings',
      icon: 'settings',
    },
  ];
  isActive(route: string): boolean {
    return this.router.url === route;
  }
  closeDrawer() {
    this.closeDrawerEvent.emit(true);
  }
  async logout() {
    try {
      await lastValueFrom(this.backendService.getApi('auth/logout'));
      this.router.navigate(['auth/login']);
    } catch (err) {
      console.log(err);
      this.toastService.add('Logout unsuccessful', 3000, 'error');
    }
  }
}
