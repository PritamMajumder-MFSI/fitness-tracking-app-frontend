import { Component } from '@angular/core';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(public authService: AuthServiceService) {}
}
