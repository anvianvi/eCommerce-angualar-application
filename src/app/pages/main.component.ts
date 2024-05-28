import { Component, OnInit, computed } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatButton, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-main',
  template: `
    <h1>This is main screen for logged-in users:</h1>
    <p>Content will appear here later, but for now it's empty.</p>
    <p>
      If you need to get to the login or registration page, open the system
      using the logout button under the profile-icon in the header.
    </p>
  `,
  styles: `
    ::ng-deep app-main {
      margin: 45px auto 0 auto;
      display: flex;
      justify-content: center;
      flex-direction: column;
      background: #f2f2f2;
      max-width: 330px;
      padding: 15px;
    }

    .buttons-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
  `,
})
export class MainComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
