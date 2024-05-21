import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerResponse } from './services/interfaces';
import { AuthCustomerService } from './services/customer-auth.service';

@Component({
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
  selector: 'app-login-page',
  template: `
    <form [formGroup]="loginForm" class="login-form">
      <mat-form-field>
        <mat-label>Enter your email</mat-label>
        <input
          matInput
          placeholder="example@email.com"
          formControlName="email"
        />
        @if (loginForm.get('email')?.hasError('required')) {
          <mat-error>You must enter an email</mat-error>
        }
        @if (loginForm.get('email')?.hasError('email')) {
          <mat-error>Provide valid email</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Enter your password</mat-label>
        <input
          matInput
          formControlName="password"
          [type]="hidepassword ? 'password' : 'text'"
        />
        <button
          mat-icon-button
          matSuffix
          (click)="hidepassword = !hidepassword"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hidepassword"
        >
          <mat-icon>{{
            hidepassword ? 'visibility_off' : 'visibility'
          }}</mat-icon>
        </button>
        @if (loginForm.get('password')?.hasError('required')) {
          <mat-error>You must enter an password</mat-error>
        }
      </mat-form-field>
      <div class="buttons-container">
        <a
          routerLink="/registration"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
          mat-button
          >Registration</a
        >

        <button
          type="submit"
          [disabled]="!loginForm.valid || submitInProcess()"
          class="button"
          mat-button
          (click)="onSubmit()"
        >
          Login
        </button>
      </div>
    </form>
  `,
  styles: `
    ::ng-deep app-login-page {
      margin: 45px auto 0 auto;
      display: flex;
      justify-content: center;
      background: #f2f2f2;
      max-width: 330px;
      padding: 15px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      width: 100%;

      h2 {
        margin: 0;
      }

      .buttons-container {
        display: flex;
        justify-content: space-between;

        a {
          background: transparent;
          color: #2f80ed;
          width: 124px;
          height: 30px;
          text-decoration: underline;
        }

        .button {
          background: #2f80ed;
          color: #ffffff;
          width: 124px;
          height: 30px;
          font-size: 12px;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  submitInProcess = signal(false);
  hidepassword = true;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthCustomerService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    // this.submitInProcess.set(true);
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log(email, password);

    this.authService.customerLogin(email, password).subscribe({
      next: (response: CustomerResponse) => {
        console.log('here is login response');
        console.log(response);
        // process login
        // rederect
        // need to setup auth guard
        //need to check tocken
      },
      complete: () => {
        console.log('Request complete');
        // this.submitInProcess.set(false);
      },
    });
  }
}
