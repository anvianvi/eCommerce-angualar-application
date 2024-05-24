import { Component, OnInit, computed } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  imports: [MatButton, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-hero',
  template: `
    <h1>Hello, this is the entrance page of the application</h1>
    <p>
      Later it will be filled with content, below are links to make it easier to
      check during the cross-checks review
    </p>
    <ul>
      <li>
        404 page - you can achieve it manually, buy enter invalid path, ex:
        ../logiasdas
      </li>
    </ul>
    <div class="buttons-container">
      <button mat-button (click)="to404()">to404</button>
    </div>
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
export class HeroComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authService.isAuthenticated();
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/main']);
    }
  }
  to404(): void {
    this.router.navigate(['/404notwork']);
  }
}
