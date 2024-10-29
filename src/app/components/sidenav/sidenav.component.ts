import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  constructor(private router: Router, public authService: AuthServiceService) {}
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
  ];
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
