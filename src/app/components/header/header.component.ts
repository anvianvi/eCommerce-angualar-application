import { Component, computed } from '@angular/core';
import { ProfileStatusBarComponent } from '../profile-status-bar/profile-status-bar.component';
import { AuthenticationService } from '../../core/services/authentication.service';
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
    ProfileStatusBarComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
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
