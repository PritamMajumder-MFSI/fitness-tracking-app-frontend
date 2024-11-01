import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
type Mode = 'dark' | 'light';
@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  private readonly platform = inject(PLATFORM_ID);

  private mode: { [key: string]: Mode } = { DARK: 'dark', LIGHT: 'light' };
  public currentMode = 'light';
  constructor() {
    if (isPlatformBrowser(this.platform)) {
      this.init();
    }
  }
  private init() {
    const deviceMode = window.matchMedia('(prefers-color-scheme: dark)');
    let initMode = localStorage.getItem('theme');
    if (!initMode) {
      deviceMode.matches
        ? (initMode = this.mode['DARK'])
        : (initMode = this.mode['LIGHT']);
    }
    this.updateCurrentMode(initMode as Mode);
  }
  public updateCurrentMode(mode: Mode) {
    localStorage.setItem('theme', mode);
    this.currentMode = mode;
    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(this.currentMode);
  }
}
