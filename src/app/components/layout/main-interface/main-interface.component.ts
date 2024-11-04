import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthServiceService } from '../../../services/auth-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main-interface',
  standalone: true,
  imports: [
    SidenavComponent,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './main-interface.component.html',
  styleUrl: './main-interface.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainInterfaceComponent {
  public headers: {
    title: string;
    subtitle: string;
    route: string;
  }[];
  constructor(private authService: AuthServiceService, private router: Router) {
    this.headers = [
      {
        title: `Welcome to TrackFit, ${this.authService.email}`,
        subtitle:
          'This is your dashboard section, here you can preview all your statistics',
        route: '/',
      },
      {
        title: 'Workouts',
        subtitle: 'View and manage all your workouts here',
        route: '/workouts',
      },
      {
        title: 'Goals',
        subtitle: 'View all your goals here',
        route: '/goals',
      },
      {
        title: 'Settings',
        subtitle: 'Manage your app settings here',
        route: '/settings',
      },
    ];
  }
  getTitleSubtitle() {
    return this.headers.find((item) => item.route == this.router.url);
  }
}
