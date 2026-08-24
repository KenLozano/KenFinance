import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
})
export class DesktopSidebarComponent {}