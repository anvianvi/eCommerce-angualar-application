import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-logi-page',
  template: `some login page
    <li>
      <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page"
        >go to the main</a
      >
    </li> `,
  styles: ``,
})
export class LoginComponent {
  // component logic
}
