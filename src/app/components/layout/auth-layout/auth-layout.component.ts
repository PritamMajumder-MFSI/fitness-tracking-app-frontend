import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RunningModelComponent } from '../../3dModels/running/running-model.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [AuthLayoutComponent, RunningModelComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
