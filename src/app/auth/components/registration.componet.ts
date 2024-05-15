import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-registration-page',
  template: ` <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" placeholder="Email" />
      <input
        formControlName="password"
        type="password"
        placeholder="Password"
      />
      <input formControlName="firstName" type="text" placeholder="First Name" />
      <input formControlName="lastName" type="text" placeholder="Last Name" />
      <button type="submit">Register</button>
    </form>
    here shoud be regesration component
    <li>
      <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page"
        >go to the main</a
      >
    </li>`,
  styles: ``,
})
export class RegistrationComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    const body = this.registerForm.value;
    //   {
    //     "email": "example@email.com",
    //     "password": "user_password",
    //     "firstName": "John",
    //     "lastName": "Doe",
    //     "dateOfBirth": "1980-01-01",
    //     "addresses": [
    //         {
    //             "streetName": "Main Street",
    //             "city": "Anytown",
    //             "postalCode": "12345",
    //             "country": "US"
    //         }
    //     ]
    // }
    this.http
      .post(
        'https://api.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905/customers',
        body,
      )
      .subscribe(
        (response) => console.log(response),
        (error) => console.error(error),
      );
  }
}
