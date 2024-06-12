import { Component, computed } from '@angular/core';
import { ProfileStatusBarComponent } from '../profile-status-bar/profile-status-bar.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { StorageService } from '../../core/storage/storage.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  imports: [
    MatButton,
    ProfileStatusBarComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatBadgeModule,
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
        <img class="logo" src="assets/logo.svg" alt="site logo" />
      </a>
    </div>
    <div class="buttons-container">
      <button mat-button routerLink="/">catalog</button>
      <button mat-button routerLink="/aboutus">about us</button>

      @if (isAuthenticated()) {
        <app-profile-status-bar></app-profile-status-bar>
      } @else {
        <button mat-button routerLink="/login">login</button>
        <button mat-button routerLink="/registration">registration</button>
      }

      <button mat-button routerLink="/basket">
        <span
          style="font-size: 26px;"
          matBadge="{{ this.cartItemsCount() }}"
          matBadgeOverlap="false"
          >🛒</span
        >
      </button>
    </div>
  </header>`,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  cartItemsCount = computed(() => {
    return this.storage.cartItemsCount();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private storage: StorageService,
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

  toBasket(): void {
    this.router.navigate(['/basket']);
  }
}
