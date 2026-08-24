import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DesktopSidebarComponent } from '../desktop-sidebar/desktop-sidebar.component';
import { MobileTabsComponent } from '../mobile-tabs/mobile-tabs.component';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    DesktopSidebarComponent,
    MobileTabsComponent,
  ],
})
export class AppShellComponent {}