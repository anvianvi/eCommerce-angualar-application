import { Component, computed } from '@angular/core';
import { ProfileStatusBarfoComponent } from './profile-status-bar.component';
import { AuthenticationService } from '../core/services/authentication.service';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatButton,
    ProfileStatusBarfoComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'app-header',
  standalone: true,
  template: `<header class="header-content-wrapper">
    <div class="logo-container">
      <a
        routerLink="/"
        routerLinkActive="active"
        ariaCurrentWhenActive="page"
        aria-label="Logo"
      >
        <img class="logo" src="assets/logo.png" alt="site logo" />
      </a>
    </div>
    <div class="buttons-container">
      <button mat-button (click)="toCatalog()">Catalog</button>

      @if (isAuthenticated()) {
        <app-profile-status-bar></app-profile-status-bar>
      } @else {
        <button mat-button (click)="toLogin()">Login</button>
        <button mat-button (click)="toRegistration()">Regestration</button>
      }
    </div>
  </header> `,
  styles: [
    `
      ::ng-deep app-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #e5e5e5;
      }

      .header-content-wrapper {
        width: min(90vw, 1200px);
        margin-inline: auto;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo-container {
        width: 50px;
      }

      .logo {
        width: 50px;
      }

      .main-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .buttons-container {
        display: flex;
        gap: 20px;
      }
    `,
  ],
})
export class HeaderComponent {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  toCatalog(): void {
    this.router.navigate(['/']);
  }

  toLogin(): void {
    this.router.navigate(['/login']);
  }

  toRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
