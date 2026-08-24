import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-mobile-tabs',
  templateUrl: './mobile-tabs.component.html',
  styleUrls: ['./mobile-tabs.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
})
export class MobileTabsComponent {}