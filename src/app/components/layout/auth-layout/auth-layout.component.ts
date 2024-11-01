import { Component } from '@angular/core';
import { RunningComponent } from '../../3dModels/running/running.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [AuthLayoutComponent, RunningComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
