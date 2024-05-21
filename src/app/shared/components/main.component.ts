import { Component, OnInit, computed } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-main',
  template: ` here shoud be main????? page
    <ul>
      <li>
        <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page"
          >go to the main</a
        >
      </li>
      <li>
        <a
          routerLink="/registration"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
          >go to the regestration</a
        >
      </li>
      <li>
        <a
          routerLink="/login"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
          >go to the login</a
        >
      </li>
    </ul>`,
  styles: ``,
})
export class MainComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authService.isAuthenticated();
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
