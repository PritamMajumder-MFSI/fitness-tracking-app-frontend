import { Component } from '@angular/core';
import { MainInterfaceComponent } from '../../components/layout/main-interface/main-interface.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MainInterfaceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
