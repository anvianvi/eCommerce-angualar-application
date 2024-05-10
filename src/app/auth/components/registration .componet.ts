import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-registration-page',
  template: `here shoud be regesration component
    <li>
      <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page"
        >go to the main</a
      >
    </li>`,
  styles: ``,
})
export class RegistrationComponent {
  // component logic
}
