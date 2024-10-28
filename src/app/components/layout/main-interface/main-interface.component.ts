import { Component } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-main-interface',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './main-interface.component.html',
  styleUrl: './main-interface.component.scss',
})
export class MainInterfaceComponent {}
