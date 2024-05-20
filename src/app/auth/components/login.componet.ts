import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-logi-page',
  template: `
  some login page
    <li>
      <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page"
        >go to the main</a
      >
    </li> `,
  styles: ``,
})
export class LoginComponent {
  constructor(private http: HttpClient) {}
  onSubmit() {
    const body = {
      email: 'johndoe@example.com',
      password: 'secret123',
    };

    this.http
      .post(
        'https://api.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905/login',
        body,
      )
      .subscribe(
        (response) => console.log(response),
        (error) => console.error(error),
      );
  }
}
