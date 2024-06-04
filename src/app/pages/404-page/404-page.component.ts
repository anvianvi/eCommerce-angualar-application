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
  templateUrl: './404-page.component.html',
  styleUrl: './404-page.component.scss',
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
