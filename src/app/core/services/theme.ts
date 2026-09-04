import {
  Injectable,
  signal,
} from '@angular/core';

export type ThemePreference =
  | 'system'
  | 'light'
  | 'dark';

const STORAGE_KEY =
  'kenfinance-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly mediaQuery =
    window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

  readonly preference =
    signal<ThemePreference>(
      this.getStoredPreference(),
    );

  constructor() {
    this.applyTheme(
      this.preference(),
    );

    this.mediaQuery.addEventListener(
      'change',
      () => {
        if (
          this.preference() ===
          'system'
        ) {
          this.applyTheme(
            'system',
          );
        }
      },
    );
  }

  setPreference(
    preference: ThemePreference,
  ): void {
    this.preference.set(
      preference,
    );

    localStorage.setItem(
      STORAGE_KEY,
      preference,
    );

    this.applyTheme(
      preference,
    );
  }

  private applyTheme(
    preference: ThemePreference,
  ): void {
    const shouldUseDark =
      preference === 'dark' ||
      (
        preference === 'system' &&
        this.mediaQuery.matches
      );

    document.documentElement
      .classList.toggle(
        'ion-palette-dark',
        shouldUseDark,
      );
  }

  private getStoredPreference():
    ThemePreference {
    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (
      stored === 'light' ||
      stored === 'dark' ||
      stored === 'system'
    ) {
      return stored;
    }

    return 'system';
  }
}