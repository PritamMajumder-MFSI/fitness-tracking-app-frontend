import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
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
}
