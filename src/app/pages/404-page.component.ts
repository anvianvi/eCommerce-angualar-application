import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="not-found-wrapper">
      <h3>404</h3>
      <p>Oops! Looks like you got lost.</p>
      <p>
        The page you are looking for might be under construction, moved, or
        doesn't exist.
      </p>
      <p>
        Let's get you back on track:
        <a
          routerLink="/main"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
          >go to the homepage</a
        >
      </p>
      <p>
        You will be redirected to the home page automatically in
        {{ counter() }} seconds...
      </p>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-not-found {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .not-found-wrapper {
        max-width: 600px;
        padding: 5px;
        display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h3 {
          font-size: 8em;
          color: #d9534f;
          margin-bottom: 1em;
        }

        p {
          font-size: 2em;
          color: #555;
          line-height: 1.1;
        }
        a {
          color: #337ab7;
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  counter = signal(9);
  timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.counter.update((value) => value - 1);

      if (this.counter() === 0) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
