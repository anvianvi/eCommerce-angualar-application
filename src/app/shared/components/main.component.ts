import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
export class MainComponent {
  // component logic
}
