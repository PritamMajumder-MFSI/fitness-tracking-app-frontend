import { Component } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-interface',
  standalone: true,
  imports: [SidenavComponent, RouterOutlet],
  templateUrl: './main-interface.component.html',
  styleUrl: './main-interface.component.scss',
})
export class MainInterfaceComponent {}
