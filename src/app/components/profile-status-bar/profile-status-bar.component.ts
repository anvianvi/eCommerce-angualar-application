import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  imports: [MatButtonModule, MatMenuModule],
  selector: 'app-profile-status-bar',
  standalone: true,
  templateUrl: './profile-status-bar.component.html',
  styleUrl: './profile-status-bar.component.scss',
})
export class ProfileStatusBarComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
