import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatMenuModule],
  selector: 'app-profile-status-bar',
  standalone: true,
  template: `
    <div class="login-info-container">
      <img
        src="assets/login.svg"
        alt="icon of logined account"
        [matMenuTriggerFor]="beforeMenu"
      />
      <mat-menu #beforeMenu="matMenu">
        <button mat-menu-item (click)="openProfile()">Profile</button>
        <button mat-menu-item (click)="logout()" [disabled]="isFetching">
          Logout
        </button>
      </mat-menu>
    </div>
  `,
  styles: [
    `
      .login-info-container {
        width: 100px;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;

        span {
          text-transform: capitalize;
          font-size: 16px;
        }

        img {
          cursor: pointer;
          height: 40px;
        }
      }
    `,
  ],
})
export class ProfileStatusBarfoComponent {
  name!: string | null;
  isFetching: boolean = false;

  constructor() {}

  openProfile(): void {
    console.log('profile process');
    // this.router.navigate(['/profile']);
  }

  logout() {
    this.isFetching = true;
    console.log('logout process');
  }
}
