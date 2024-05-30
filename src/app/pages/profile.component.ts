import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-user-profile',
  template: `<div>
    <h1>
      Here should be User Profile Page. It should display information about a
      user's profile.
    </h1>
    <button (click)="goBack()">Back</button>
  </div>`,
  styles: ``,
})
export class ProfileComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
